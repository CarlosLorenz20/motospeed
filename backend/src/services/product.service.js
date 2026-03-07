const { Op } = require('sequelize');
const { Product, Category } = require('../models');

class ProductService {
  /**
   * Obtener productos con filtros y paginación
   */
  async getProducts(page, limit, filters, orderBy, order) {
    const offset = (page - 1) * limit;
    const where = { activo: true };

    // Aplicar filtros
    if (filters.category) {
      const category = await Category.findOne({
        where: { slug: filters.category }
      });
      if (category) {
        where.category_id = category.id;
      }
    }

    if (filters.search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${filters.search}%` } },
        { descripcion: { [Op.like]: `%${filters.search}%` } },
        { marca: { [Op.like]: `%${filters.search}%` } },
        { sku: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    if (filters.minPrice) {
      where.precio = { ...where.precio, [Op.gte]: filters.minPrice };
    }

    if (filters.maxPrice) {
      where.precio = { ...where.precio, [Op.lte]: filters.maxPrice };
    }

    if (filters.marca) {
      where.marca = filters.marca;
    }

    if (filters.destacado) {
      where.destacado = true;
    }

    const { rows: products, count: total } = await Product.findAndCountAll({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'nombre', 'slug']
      }],
      order: [[orderBy, order]],
      limit,
      offset
    });

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Obtener producto por ID o slug
   */
  async getProductByIdOrSlug(identifier) {
    const where = isNaN(identifier)
      ? { slug: identifier, activo: true }
      : { id: identifier, activo: true };

    const product = await Product.findOne({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'nombre', 'slug']
      }]
    });

    if (!product) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return product;
  }

  /**
   * Obtener productos destacados
   */
  async getFeaturedProducts(limit) {
    return Product.findAll({
      where: {
        activo: true,
        destacado: true,
        stock: { [Op.gt]: 0 }
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'nombre', 'slug']
      }],
      order: [['created_at', 'DESC']],
      limit
    });
  }

  /**
   * Obtener productos por categoría
   */
  async getProductsByCategory(categorySlug, page, limit) {
    const category = await Category.findOne({
      where: { slug: categorySlug, activa: true }
    });

    if (!category) {
      const error = new Error('Categoría no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const offset = (page - 1) * limit;

    const { rows: products, count: total } = await Product.findAndCountAll({
      where: {
        category_id: category.id,
        activo: true
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'nombre', 'slug']
      }],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      data: products,
      category,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Crear producto (admin)
   */
  async createProduct(data) {
    // Generar slug si no viene
    if (!data.slug) {
      data.slug = this.generateSlug(data.nombre);
    }

    return Product.create(data);
  }

  /**
   * Actualizar producto (admin)
   */
  async updateProduct(id, data) {
    const product = await Product.findByPk(id);

    if (!product) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Si se actualiza el nombre, regenerar slug
    if (data.nombre && !data.slug) {
      data.slug = this.generateSlug(data.nombre);
    }

    await product.update(data);

    return product;
  }

  /**
   * Eliminar producto (soft delete - desactivar)
   */
  async deleteProduct(id) {
    const product = await Product.findByPk(id);

    if (!product) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    await product.update({ activo: false });

    return true;
  }

  /**
   * Obtener todas las categorías activas con conteo de productos
   */
  async getCategories() {
    const categories = await Category.findAll({
      where: { activa: true },
      order: [['nombre', 'ASC']],
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id'],
        where: { activo: true },
        required: false
      }]
    });

    // Mapear para incluir el conteo
    return categories.map(cat => ({
      id: cat.id,
      nombre: cat.nombre,
      slug: cat.slug,
      descripcion: cat.descripcion,
      productCount: cat.products ? cat.products.length : 0
    }));
  }

  /**
   * Buscar productos
   */
  async searchProducts(query, limit) {
    return Product.findAll({
      where: {
        activo: true,
        [Op.or]: [
          { nombre: { [Op.like]: `%${query}%` } },
          { descripcion: { [Op.like]: `%${query}%` } },
          { marca: { [Op.like]: `%${query}%` } },
          { sku: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'nombre', 'slug']
      }],
      limit
    });
  }

  /**
   * Generar slug desde nombre
   */
  generateSlug(nombre) {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Verificar stock de productos
   */
  async checkStock(items) {
    const results = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      
      if (!product) {
        results.push({
          productId: item.productId,
          available: false,
          message: 'Producto no encontrado'
        });
        continue;
      }

      if (!product.activo) {
        results.push({
          productId: item.productId,
          available: false,
          message: 'Producto no disponible'
        });
        continue;
      }

      if (product.stock < item.quantity) {
        results.push({
          productId: item.productId,
          available: false,
          message: `Stock insuficiente. Disponible: ${product.stock}`,
          stock: product.stock
        });
        continue;
      }

      results.push({
        productId: item.productId,
        available: true,
        product
      });
    }

    return results;
  }

  /**
   * Decrementar stock
   */
  async decrementStock(productId, quantity) {
    const product = await Product.findByPk(productId);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (product.stock < quantity) {
      throw new Error('Stock insuficiente');
    }

    await product.update({
      stock: product.stock - quantity
    });

    return product;
  }
}

module.exports = new ProductService();
