import { useState, useEffect, useRef } from 'react';
import { getImageUrl } from '../../../lib/imageUtils';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  FiTruck, FiShield, FiHeadphones, FiCreditCard, FiArrowRight, 
  FiStar, FiChevronLeft, FiChevronRight, FiBox, FiSettings,
  FiZap, FiPackage, FiTool, FiHardDrive
} from 'react-icons/fi';
import { getProducts, getCategories } from '../../products/services/productsApi';
import type { Product, Category } from '../../../types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(2);
  
  // Refs for parallax
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Scroll progress for parallax
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);
  
  // InView animations
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts(1, 10, { destacado: true }),
          getCategories()
        ]);
        setFeaturedProducts(productsRes.data);
        setCategories(categoriesRes);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (featuredProducts.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const categoryIcons: Record<string, React.ElementType> = {
    'motos': FiSettings,
    'repuestos-motor': FiTool,
    'frenos-suspension': FiHardDrive,
    'electrico': FiZap,
    'accesorios': FiPackage,
    'cascos-seguridad': FiShield,
    'lubricantes': FiBox,
    'neumaticos': FiSettings
  };

  const features = [
    {
      icon: FiTruck,
      title: 'Envío a Todo Chile',
      description: 'Despacho rápido y seguro a cualquier región del país.',
      color: 'text-primary-600',
      bg: 'bg-primary-50'
    },
    {
      icon: FiShield,
      title: 'Repuestos Genuinos',
      description: 'Solo trabajamos con marcas certificadas y proveedores confiables.',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: FiHeadphones,
      title: 'Asistencia Técnica',
      description: 'Equipo experto disponible para asesorarte en tu compra.',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: FiCreditCard,
      title: 'Pago Seguro',
      description: 'Pagos procesados por Mercado Pago - débito, crédito y más.',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  // Calculate 3D position for each card
  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    
    // Wrap around for circular carousel
    let adjustedDiff = diff;
    if (diff > featuredProducts.length / 2) adjustedDiff = diff - featuredProducts.length;
    if (diff < -featuredProducts.length / 2) adjustedDiff = diff + featuredProducts.length;
    
    const isActive = adjustedDiff === 0;
    const translateX = adjustedDiff * 220;
    const translateZ = isActive ? 0 : -150 - Math.abs(adjustedDiff) * 50;
    const rotateY = adjustedDiff * -25;
    const scale = isActive ? 1 : 0.85 - Math.abs(adjustedDiff) * 0.05;
    const opacity = Math.abs(adjustedDiff) > 2 ? 0 : 1 - Math.abs(adjustedDiff) * 0.2;
    const zIndex = 10 - Math.abs(adjustedDiff);

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
    };
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
        {/* Background with parallax */}
        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        >
          <div className="absolute inset-0 opacity-20">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full filter blur-3xl"
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.2, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 4 }}
              className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl"
            />
          </div>
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="container mx-auto px-4 py-20 relative z-10"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.span 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/20 text-primary-400 rounded-full text-sm font-medium mb-6"
              >
                <FiStar className="w-4 h-4" />
                Envíos a todo Chile
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Tu Tienda de{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-orange-400">
                  Motos y Repuestos
                </span>{' '}
                en Chile
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0"
              >
                Encuentra motos, repuestos genuinos y accesorios al mejor precio. 
                Calidad garantizada con soporte técnico experto.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link 
                  to="/tienda"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-0.5"
                >
                  <FiShield className="w-5 h-5" />
                  Ir a la Tienda
                  <motion.span
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <FiArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
                <Link 
                  to="/servicios"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
                >
                  Nuestros Servicios
                  <FiArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Stats */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="hidden lg:flex justify-center items-center"
            >
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-primary-500/30 to-orange-500/30 rounded-full filter blur-3xl absolute"></div>
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 mx-auto mb-6 border-4 border-primary-500/30 rounded-full flex items-center justify-center"
                  >
                    <FiSettings className="w-16 h-16 text-primary-400" />
                  </motion.div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + i * 0.1 }}
                      >
                        <FiStar className="w-6 h-6 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-white/60">+5,000 clientes satisfechos</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full">
            <path fill="#f9fafb" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </section>

      {/* Categorías rápidas with animation */}
      <section className="bg-gray-50 py-6 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {categories.slice(0, 6).map((category, index) => {
              const IconComponent = categoryIcons[category.slug] || FiBox;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Link
                    to={`/tienda?category=${category.slug}`}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all group"
                  >
                    <IconComponent className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">
                      {category.nombre}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Productos Destacados - 3D Coverflow Carousel */}
      <section className="py-16 lg:py-24 bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Productos Destacados
            </h2>
            <p className="text-gray-400">Los más populares de nuestra tienda</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="relative">
              {/* 3D Carousel Container */}
              <div 
                className="relative h-[450px] flex items-center justify-center"
                style={{ perspective: '1000px' }}
              >
                <div className="relative w-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                  <AnimatePresence>
                    {featuredProducts.map((product, index) => {
                      const style = getCardStyle(index);
                      const isActive = index === activeIndex;
                      
                      return (
                        <motion.div
                          key={product.id}
                          className="absolute w-72"
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: style.opacity,
                            zIndex: style.zIndex
                          }}
                          style={{
                            transform: style.transform,
                            transformStyle: 'preserve-3d',
                          }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                          <Link 
                            to={`/productos/${product.slug}`}
                            className={`block rounded-2xl overflow-hidden shadow-2xl transition-all ${
                              isActive ? 'ring-4 ring-primary-500/50' : ''
                            }`}
                            style={{
                              background: product.imagen ? '#1f2937' : `linear-gradient(135deg, ${
                                index % 5 === 0 ? '#ef4444, #dc2626' :
                                index % 5 === 1 ? '#8b5cf6, #7c3aed' :
                                index % 5 === 2 ? '#06b6d4, #0891b2' :
                                index % 5 === 3 ? '#3b82f6, #2563eb' :
                                '#f43f5e, #e11d48'
                              })`
                            }}
                          >
                            {/* Product Image */}
                            {product.imagen ? (
                              <div className="w-full h-40 overflow-hidden">
                                <img 
                                  src={getImageUrl(product.imagen) ?? ''}
                                  alt={product.nombre}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-full h-40 flex items-center justify-center" style={{
                                background: `linear-gradient(135deg, ${
                                  index % 5 === 0 ? '#ef4444, #dc2626' :
                                  index % 5 === 1 ? '#8b5cf6, #7c3aed' :
                                  index % 5 === 2 ? '#06b6d4, #0891b2' :
                                  index % 5 === 3 ? '#3b82f6, #2563eb' :
                                  '#f43f5e, #e11d48'
                                })`
                              }}>
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                  <FiSettings className="w-8 h-8 text-white" />
                                </div>
                              </div>
                            )}
                            
                            {/* Card Content */}
                            <div className="p-5 text-white" style={{
                              background: product.imagen ? `linear-gradient(135deg, ${
                                index % 5 === 0 ? '#ef4444, #dc2626' :
                                index % 5 === 1 ? '#8b5cf6, #7c3aed' :
                                index % 5 === 2 ? '#06b6d4, #0891b2' :
                                index % 5 === 3 ? '#3b82f6, #2563eb' :
                                '#f43f5e, #e11d48'
                              })` : 'transparent'
                            }}>
                              {/* Title */}
                              <h3 className="text-lg font-bold mb-2 line-clamp-1">
                                {product.nombre}
                              </h3>
                              
                              {/* Description */}
                              <p className="text-white/80 text-sm mb-3 line-clamp-2">
                                {product.descripcion || 'Producto de alta calidad para tu moto.'}
                              </p>
                              
                              {/* Price */}
                              <div className="flex items-end justify-between">
                                <div>
                                  {product.precio_oferta ? (
                                    <>
                                      <p className="text-xs text-white/60 line-through">
                                        {formatPrice(product.precio)}
                                      </p>
                                      <p className="text-xl font-bold">
                                        {formatPrice(product.precio_oferta)}
                                      </p>
                                    </>
                                  ) : (
                                    <p className="text-xl font-bold">
                                      {formatPrice(product.precio)}
                                    </p>
                                  )}
                                </div>
                                {isActive && (
                                  <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-sm font-medium flex items-center gap-1"
                                  >
                                    Ver más <FiArrowRight />
                                  </motion.span>
                                )}
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex justify-center gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrev}
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <FiChevronRight className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Dots indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {featuredProducts.slice(0, 7).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`transition-all duration-300 ${
                      index === activeIndex 
                        ? 'w-8 h-2 bg-primary-500 rounded-full' 
                        : 'w-2 h-2 bg-white/30 rounded-full hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link 
              to="/tienda"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium"
            >
              Ver todos los productos
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ¿Por qué elegirnos? with Parallax */}
      <section ref={featuresRef} className="py-16 lg:py-24 bg-white relative overflow-hidden">
        {/* Parallax background elements */}
        <motion.div
          style={{ 
            y: useTransform(scrollYProgress, [0.3, 0.6], [100, -100])
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full filter blur-3xl opacity-50"
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Llevamos años siendo el referente en repuestos y motos en Chile
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section with Parallax */}
      <section ref={ctaRef} className="py-16 lg:py-24 bg-gradient-to-r from-primary-600 to-primary-700 relative overflow-hidden">
        {/* Animated background */}
        <motion.div
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 5 }}
          className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full filter blur-3xl"
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              ¿Listo para encontrar lo que necesitas?
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Navega nuestra tienda y encuentra los mejores repuestos al mejor precio.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to="/tienda"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
              >
                <FiShield className="w-5 h-5" />
                Entrar a la Tienda
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
