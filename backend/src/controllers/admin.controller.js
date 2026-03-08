const { Product, Category, Order, User } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

/**
 * Dashboard stats
 */
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalCategories,
      recentOrders,
      topProducts
    ] = await Promise.all([
      Product.count(),
      Order.count(),
      User.count({ where: { role: 'cliente' } }),
      Category.count(),
      Order.findAll({
        limit: 5,
        order: [['created_at', 'DESC']],
        include: [
          { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
          { model: Product, as: 'product', attributes: ['id', 'nombre', 'imagen'] }
        ]
      }),
      Product.findAll({
        limit: 5,
        order: [['stock', 'ASC']],
        where: { activo: true },
        attributes: ['id', 'nombre', 'stock', 'imagen', 'precio']
      })
    ]);

    // Calcular ingresos del mes
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyOrders = await Order.findAll({
      where: {
        estado: 'pagado',
        created_at: { [Op.gte]: startOfMonth }
      }
    });

    const monthlyRevenue = monthlyOrders.reduce((total, order) => total + parseFloat(order.total), 0);

    return successResponse(res, {
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalCategories,
        monthlyRevenue
      },
      recentOrders,
      lowStockProducts: topProducts
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return errorResponse(res, 'Error al obtener estadísticas', 500);
  }
};

/**
 * Listar todos los productos (admin)
 */
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
        { marca: { [Op.like]: `%${search}%` } }
      ];
    }

    if (category) {
      where.category_id = category;
    }

    if (status !== undefined) {
      where.activo = status === 'true';
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'nombre', 'slug'] }],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, {
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error listing products:', error);
    return errorResponse(res, 'Error al listar productos', 500);
  }
};

/**
 * Crear producto
 */
const createProduct = async (req, res) => {
  try {
    console.log('=== CREATE PRODUCT ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const {
      category_id,
      nombre,
      descripcion,
      sku,
      precio,
      precio_oferta,
      stock,
      marca,
      modelo_compatible,
      destacado
    } = req.body;

    // Generar slug
    const slug = nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Verificar si existe el SKU
    const existingSku = await Product.findOne({ where: { sku } });
    if (existingSku) {
      return errorResponse(res, 'El SKU ya existe', 400);
    }

    // URL de imagen si se subió
    let imagen = null;
    if (req.file) {
      imagen = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.create({
      category_id,
      nombre,
      slug,
      descripcion,
      sku,
      precio: parseFloat(precio),
      precio_oferta: precio_oferta ? parseFloat(precio_oferta) : null,
      stock: parseInt(stock) || 0,
      imagen,
      marca,
      modelo_compatible,
      destacado: destacado === 'true' || destacado === true,
      activo: true
    });

    const productWithCategory = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }]
    });

    return successResponse(res, productWithCategory, 'Producto creado exitosamente', 201);
  } catch (error) {
    console.error('Error creating product:', error);
    // Si hubo error y se subió imagen, eliminarla
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads/products', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return errorResponse(res, error.message || 'Error al crear producto', 500);
  }
};

/**
 * Actualizar producto
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category_id,
      nombre,
      descripcion,
      sku,
      precio,
      precio_oferta,
      stock,
      marca,
      modelo_compatible,
      destacado,
      activo
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return errorResponse(res, 'Producto no encontrado', 404);
    }

    // Verificar SKU único si cambió
    if (sku && sku !== product.sku) {
      const existingSku = await Product.findOne({ where: { sku, id: { [Op.ne]: id } } });
      if (existingSku) {
        return errorResponse(res, 'El SKU ya existe', 400);
      }
    }

    // Generar nuevo slug si cambió el nombre
    let slug = product.slug;
    if (nombre && nombre !== product.nombre) {
      slug = nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Manejar imagen
    let imagen = product.imagen;
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (product.imagen) {
        const oldPath = path.join(__dirname, '../..', product.imagen);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      imagen = `/uploads/products/${req.file.filename}`;
    }

    await product.update({
      category_id: category_id || product.category_id,
      nombre: nombre || product.nombre,
      slug,
      descripcion: descripcion !== undefined ? descripcion : product.descripcion,
      sku: sku || product.sku,
      precio: precio ? parseFloat(precio) : product.precio,
      precio_oferta: precio_oferta !== undefined ? (precio_oferta ? parseFloat(precio_oferta) : null) : product.precio_oferta,
      stock: stock !== undefined ? parseInt(stock) : product.stock,
      imagen,
      marca: marca !== undefined ? marca : product.marca,
      modelo_compatible: modelo_compatible !== undefined ? modelo_compatible : product.modelo_compatible,
      destacado: destacado !== undefined ? (destacado === 'true' || destacado === true) : product.destacado,
      activo: activo !== undefined ? (activo === 'true' || activo === true) : product.activo
    });

    const updatedProduct = await Product.findByPk(id, {
      include: [{ model: Category, as: 'category' }]
    });

    return successResponse(res, updatedProduct, 'Producto actualizado exitosamente');
  } catch (error) {
    console.error('Error updating product:', error);
    return errorResponse(res, error.message || 'Error al actualizar producto', 500);
  }
};

/**
 * Eliminar producto
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return errorResponse(res, 'Producto no encontrado', 404);
    }

    // Eliminar imagen si existe
    if (product.imagen) {
      const imagePath = path.join(__dirname, '../..', product.imagen);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.destroy();

    return successResponse(res, null, 'Producto eliminado exitosamente');
  } catch (error) {
    console.error('Error deleting product:', error);
    return errorResponse(res, 'Error al eliminar producto', 500);
  }
};

/**
 * Obtener todas las órdenes (admin)
 */
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, dateFrom, dateTo } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    if (status) {
      where.estado = status;
    }

    if (dateFrom || dateTo) {
      where.created_at = {};
      if (dateFrom) {
        where.created_at[Op.gte] = new Date(dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        where.created_at[Op.lte] = endDate;
      }
    }

    const include = [
      { 
        model: User, 
        as: 'user', 
        attributes: ['id', 'name', 'email', 'telefono'],
        where: search ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
          ]
        } : undefined,
        required: !!search
      },
      { 
        model: Product, 
        as: 'product', 
        attributes: ['id', 'nombre', 'imagen', 'precio', 'sku'] 
      }
    ];

    const { count, rows } = await Order.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, {
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error listing orders:', error);
    return errorResponse(res, 'Error al listar órdenes', 500);
  }
};

/**
 * Obtener detalle de orden
 */
const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'telefono'] },
        { model: Product, as: 'product' }
      ]
    });

    if (!order) {
      return errorResponse(res, 'Orden no encontrada', 404);
    }

    return successResponse(res, order);
  } catch (error) {
    console.error('Error getting order detail:', error);
    return errorResponse(res, 'Error al obtener orden', 500);
  }
};

/**
 * Actualizar estado de orden
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const validStatuses = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado', 'fallido'];
    if (!validStatuses.includes(estado)) {
      return errorResponse(res, 'Estado no válido', 400);
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return errorResponse(res, 'Orden no encontrada', 404);
    }

    await order.update({ estado });

    const updatedOrder = await Order.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Product, as: 'product', attributes: ['id', 'nombre', 'imagen'] }
      ]
    });

    return successResponse(res, updatedOrder, 'Estado de orden actualizado');
  } catch (error) {
    console.error('Error updating order status:', error);
    return errorResponse(res, 'Error al actualizar orden', 500);
  }
};

/**
 * Listar categorías
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['nombre', 'ASC']],
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id']
      }]
    });

    // Agregar conteo de productos
    const categoriesWithCount = categories.map(cat => ({
      ...cat.toJSON(),
      productCount: cat.products?.length || 0
    }));

    return successResponse(res, categoriesWithCount);
  } catch (error) {
    console.error('Error listing categories:', error);
    return errorResponse(res, 'Error al listar categorías', 500);
  }
};

/**
 * Crear categoría
 */
const createCategory = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const slug = nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const category = await Category.create({
      nombre,
      slug,
      descripcion,
      activa: true
    });

    return successResponse(res, category, 'Categoría creada exitosamente', 201);
  } catch (error) {
    console.error('Error creating category:', error);
    return errorResponse(res, error.message || 'Error al crear categoría', 500);
  }
};

/**
 * Actualizar categoría
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activa } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return errorResponse(res, 'Categoría no encontrada', 404);
    }

    let slug = category.slug;
    if (nombre && nombre !== category.nombre) {
      slug = nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    await category.update({
      nombre: nombre || category.nombre,
      slug,
      descripcion: descripcion !== undefined ? descripcion : category.descripcion,
      activa: activa !== undefined ? activa : category.activa
    });

    return successResponse(res, category, 'Categoría actualizada');
  } catch (error) {
    console.error('Error updating category:', error);
    return errorResponse(res, 'Error al actualizar categoría', 500);
  }
};

/**
 * Eliminar categoría
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return errorResponse(res, 'Categoría no encontrada', 404);
    }

    // Verificar si tiene productos
    const productCount = await Product.count({ where: { category_id: id } });
    if (productCount > 0) {
      return errorResponse(res, `No se puede eliminar. La categoría tiene ${productCount} producto(s) asociado(s)`, 400);
    }

    await category.destroy();

    return successResponse(res, null, 'Categoría eliminada');
  } catch (error) {
    console.error('Error deleting category:', error);
    return errorResponse(res, 'Error al eliminar categoría', 500);
  }
};

module.exports = {
  getDashboardStats,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getOrderDetail,
  updateOrderStatus,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
