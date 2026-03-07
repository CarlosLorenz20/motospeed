/**
 * Script para crear datos de prueba en la base de datos
 * Ejecutar con: node src/seeds/seed.js
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { sequelize } = require('../config/db');
const { User, Category, Product, Order } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed de la base de datos...\n');

    // Conectar a la BD
    await sequelize.authenticate();
    console.log('✅ Conexión establecida\n');

    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ alter: false });

    // 1. Crear categorías
    console.log('📁 Creando categorías...');
    const categorias = await Category.bulkCreate([
      {
        nombre: 'Cascos',
        slug: 'cascos',
        descripcion: 'Cascos de seguridad para motocicletas',
        activa: true
      },
      {
        nombre: 'Guantes',
        slug: 'guantes',
        descripcion: 'Guantes de protección para motociclistas',
        activa: true
      },
      {
        nombre: 'Chaquetas',
        slug: 'chaquetas',
        descripcion: 'Chaquetas de protección para moto',
        activa: true
      },
      {
        nombre: 'Accesorios',
        slug: 'accesorios',
        descripcion: 'Accesorios varios para moto',
        activa: true
      }
    ], { ignoreDuplicates: true });
    console.log(`   ✓ ${categorias.length} categorías creadas\n`);

    // Obtener IDs de categorías
    const catCascos = await Category.findOne({ where: { slug: 'cascos' }});
    const catGuantes = await Category.findOne({ where: { slug: 'guantes' }});
    const catChaquetas = await Category.findOne({ where: { slug: 'chaquetas' }});
    const catAccesorios = await Category.findOne({ where: { slug: 'accesorios' }});

    // 2. Crear productos
    console.log('🏍️  Creando productos...');
    const productos = await Product.bulkCreate([
      // Cascos
      {
        category_id: catCascos.id,
        nombre: 'Casco AGV K1 Negro Mate',
        slug: 'casco-agv-k1-negro-mate',
        descripcion: 'Casco integral AGV K1, diseño aerodinámico con ventilación avanzada. Homologación ECE 22.05.',
        sku: 'AGV-K1-001',
        precio: 189990,
        precio_oferta: 169990,
        stock: 15,
        imagen: 'https://placehold.co/400x400/000/fff?text=AGV+K1',
        marca: 'AGV',
        modelo_compatible: 'Universal',
        destacado: true,
        activo: true
      },
      {
        category_id: catCascos.id,
        nombre: 'Casco LS2 FF353 Rapid',
        slug: 'casco-ls2-ff353-rapid',
        descripcion: 'Casco integral LS2 FF353 Rapid, policarbonato ligero, pantalla antirrayas incluida.',
        sku: 'LS2-FF353-001',
        precio: 79990,
        stock: 25,
        imagen: 'https://placehold.co/400x400/333/fff?text=LS2+FF353',
        marca: 'LS2',
        modelo_compatible: 'Universal',
        destacado: true,
        activo: true
      },
      {
        category_id: catCascos.id,
        nombre: 'Casco HJC i70 Elim',
        slug: 'casco-hjc-i70-elim',
        descripcion: 'Casco integral HJC i70 con sistema de ventilación Smart HJC, visera solar integrada.',
        sku: 'HJC-I70-001',
        precio: 159990,
        precio_oferta: 139990,
        stock: 10,
        imagen: 'https://placehold.co/400x400/444/fff?text=HJC+i70',
        marca: 'HJC',
        modelo_compatible: 'Universal',
        destacado: false,
        activo: true
      },
      // Guantes
      {
        category_id: catGuantes.id,
        nombre: 'Guantes Alpinestars SP-8 V3',
        slug: 'guantes-alpinestars-sp8-v3',
        descripcion: 'Guantes deportivos Alpinestars con protección de nudillos y palma reforzada en cuero.',
        sku: 'ALP-SP8V3-001',
        precio: 89990,
        precio_oferta: 79990,
        stock: 30,
        imagen: 'https://placehold.co/400x400/111/fff?text=Alpinestars',
        marca: 'Alpinestars',
        modelo_compatible: 'Universal',
        destacado: true,
        activo: true
      },
      {
        category_id: catGuantes.id,
        nombre: 'Guantes Dainese Carbon 4',
        slug: 'guantes-dainese-carbon-4',
        descripcion: 'Guantes racing Dainese con fibra de carbono, máxima protección para pista y calle.',
        sku: 'DAIN-CARB4-001',
        precio: 149990,
        stock: 12,
        imagen: 'https://placehold.co/400x400/222/fff?text=Dainese',
        marca: 'Dainese',
        modelo_compatible: 'Universal',
        destacado: false,
        activo: true
      },
      // Chaquetas
      {
        category_id: catChaquetas.id,
        nombre: 'Chaqueta Rev\'it Tornado 3',
        slug: 'chaqueta-revit-tornado-3',
        descripcion: 'Chaqueta textil Rev\'it con protecciones certificadas, impermeable y transpirable.',
        sku: 'REVIT-TORN3-001',
        precio: 299990,
        precio_oferta: 259990,
        stock: 8,
        imagen: 'https://placehold.co/400x400/555/fff?text=Revit',
        marca: 'Rev\'it',
        modelo_compatible: 'Universal',
        destacado: true,
        activo: true
      },
      {
        category_id: catChaquetas.id,
        nombre: 'Chaqueta Alpinestars T-GP R V2',
        slug: 'chaqueta-alpinestars-tgp-r-v2',
        descripcion: 'Chaqueta sport touring Alpinestars con armadura Bio-Armor y forro térmico removible.',
        sku: 'ALP-TGPRV2-001',
        precio: 249990,
        stock: 5,
        imagen: 'https://placehold.co/400x400/666/fff?text=Alpinestars+Jacket',
        marca: 'Alpinestars',
        modelo_compatible: 'Universal',
        destacado: false,
        activo: true
      },
      // Accesorios
      {
        category_id: catAccesorios.id,
        nombre: 'Intercomunicador Cardo Packtalk Edge',
        slug: 'intercomunicador-cardo-packtalk-edge',
        descripcion: 'Intercomunicador Bluetooth con tecnología DMC, hasta 15 pilotos conectados, sonido JBL.',
        sku: 'CARDO-PTE-001',
        precio: 349990,
        precio_oferta: 319990,
        stock: 20,
        imagen: 'https://placehold.co/400x400/777/fff?text=Cardo',
        marca: 'Cardo',
        modelo_compatible: 'Universal',
        destacado: true,
        activo: true
      },
      {
        category_id: catAccesorios.id,
        nombre: 'Candado Disco ABUS Granit Detecto',
        slug: 'candado-disco-abus-granit-detecto',
        descripcion: 'Candado de disco con alarma 100db, acero endurecido 3D, incluye bolsa de transporte.',
        sku: 'ABUS-GD-001',
        precio: 129990,
        stock: 18,
        imagen: 'https://placehold.co/400x400/888/fff?text=ABUS',
        marca: 'ABUS',
        modelo_compatible: 'Universal',
        destacado: false,
        activo: true
      },
      {
        category_id: catAccesorios.id,
        nombre: 'Maleta Top Case GIVI E470',
        slug: 'maleta-top-case-givi-e470',
        descripcion: 'Maleta superior GIVI de 47 litros, capacidad para casco integral, sistema Monolock.',
        sku: 'GIVI-E470-001',
        precio: 119990,
        precio_oferta: 99990,
        stock: 7,
        imagen: 'https://placehold.co/400x400/999/fff?text=GIVI',
        marca: 'GIVI',
        modelo_compatible: 'Universal',
        destacado: false,
        activo: true
      }
    ], { ignoreDuplicates: true });
    console.log(`   ✓ ${productos.length} productos creados\n`);

    // 3. Crear usuario admin de prueba
    console.log('👤 Creando usuario de prueba...');
    const [user, created] = await User.findOrCreate({
      where: { email: 'admin@motospeed.cl' },
      defaults: {
        name: 'Admin MotoSpeed',
        email: 'admin@motospeed.cl',
        password: 'admin123',
        telefono: '912345678',
        role: 'admin'
      }
    });
    console.log(`   ✓ Usuario ${created ? 'creado' : 'ya existía'}: admin@motospeed.cl\n`);

    console.log('🎉 Seed completado exitosamente!\n');
    console.log('📋 Resumen:');
    console.log('   - Categorías: 4');
    console.log('   - Productos: 10');
    console.log('   - Usuario admin: admin@motospeed.cl / admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
