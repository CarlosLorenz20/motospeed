import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  FiSettings, FiTool, FiPackage, FiTruck, FiCheck, 
  FiPhone, FiAward, FiUsers, FiBox, FiShield
} from 'react-icons/fi';
import { FaWhatsapp, FaMotorcycle } from 'react-icons/fa';

export default function ServicesPage() {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -150]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const services = [
    {
      icon: FiSettings,
      title: 'Mantenimiento Preventivo',
      description: 'Revisión completa de tu moto: aceite, filtros, frenos, cadena y ajuste general.',
      features: [
        'Cambio de aceite y filtro',
        'Revisión frenos y neumáticos',
        'Ajuste de cadena y válvulas',
        'Limpieza de carburador/inyección'
      ],
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: FiTool,
      title: 'Reparación de Motor',
      description: 'Mecánicos certificados para reparaciones de motor, transmisión y sistema de escape.',
      features: [
        'Rectificación de cilindro',
        'Cambio de pistón y segmentos',
        'Reparación de culata',
        'Diagnóstico electrónico'
      ],
      gradient: 'from-red-500 to-red-600'
    },
    {
      icon: FiPackage,
      title: 'Instalación de Accesorios',
      description: 'Instalación profesional de accesorios, portaequipajes y sistemas de iluminación.',
      features: [
        'Portaequipajes y maletas',
        'Sistemas LED personalizados',
        'Protecciones y crash bars',
        'GPS y alarmas'
      ],
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: FaMotorcycle,
      title: 'Venta de Motos',
      description: 'Amplio stock de motos nuevas de las principales marcas con financiamiento.',
      features: [
        'Honda, Yamaha, Suzuki',
        'Motos de trabajo y sport',
        'Scooters y enduro',
        'Financiamiento disponible'
      ],
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      icon: FiBox,
      title: 'Repuestos y Accesorios',
      description: 'Catálogo completo de repuestos genuinos y accesorios para todas las marcas y modelos.',
      features: [
        'Repuestos originales',
        'Partes de motor',
        'Sistema eléctrico',
        'Equipamiento para el piloto'
      ],
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: FiTruck,
      title: 'Envíos a Todo Chile',
      description: 'Despacho express a cualquier región del país. Embalaje seguro para todos los productos.',
      features: [
        'Envío en 24-72 horas',
        'Regiones extremas disponibles',
        'Tracking en tiempo real',
        'Seguro de envío incluido'
      ],
      gradient: 'from-teal-500 to-teal-600'
    }
  ];

  const stats = [
    { value: '10+', label: 'Años en el mercado', icon: FiAward },
    { value: '5.000+', label: 'Clientes satisfechos', icon: FiUsers },
    { value: '500+', label: 'Productos en stock', icon: FiBox },
    { value: '100%', label: 'Garantía de calidad', icon: FiShield }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative py-20 lg:py-28 overflow-hidden">
        {/* Background with parallax */}
        <motion.div 
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        >
          <div className="absolute inset-0 opacity-20">
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 10, 0]
              }}
              transition={{ duration: 15, repeat: Infinity }}
              className="absolute top-20 right-20 w-72 h-72 bg-primary-600 rounded-full filter blur-3xl"
            />
            <motion.div 
              animate={{ 
                scale: [1.3, 1, 1.3],
                rotate: [0, -10, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, delay: 7 }}
              className="absolute bottom-20 left-20 w-72 h-72 bg-orange-500 rounded-full filter blur-3xl"
            />
          </div>
        </motion.div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-6 py-2 bg-primary-600/20 text-primary-400 rounded-full text-sm font-medium mb-6"
          >
            Nuestros Servicios
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 italic"
          >
            Lo que hacemos por tu moto
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Más que una tienda, somos tu centro integral de moto. Desde la venta hasta el mantenimiento.
          </motion.p>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full">
            <path fill="#ffffff" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </section>

      {/* Services Grid with Stagger Animation */}
      <section ref={servicesRef} className="py-16 lg:py-24 bg-white relative">
        {/* Parallax background elements */}
        <motion.div
          style={{ 
            y: useTransform(scrollYProgress, [0.2, 0.5], [50, -50])
          }}
          className="absolute top-40 left-0 w-64 h-64 bg-primary-100 rounded-full filter blur-3xl opacity-40"
        />
        <motion.div
          style={{ 
            y: useTransform(scrollYProgress, [0.3, 0.6], [-50, 50])
          }}
          className="absolute bottom-40 right-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-40"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                  transition: { duration: 0.3 }
                }}
                className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 transition-all duration-300"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                >
                  <service.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={featureIndex} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: featureIndex * 0.1 }}
                      className="flex items-center gap-3 text-sm text-gray-700"
                    >
                      <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiCheck className="w-3 h-3 text-primary-600" />
                      </div>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Counter Animation */}
      <section ref={statsRef} className="py-16 lg:py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Animated background */}
        <motion.div
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(45deg, #ef4444 25%, transparent 25%, transparent 75%, #ef4444 75%, #ef4444)',
            backgroundSize: '60px 60px'
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Más de 10 años de experiencia
            </h2>
            <p className="text-gray-400">
              Somos el taller y tienda de confianza de miles de moteros en Chile
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-700/50 hover:border-primary-500/50 transition-all"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={statsInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                  className="w-12 h-12 mx-auto mb-4 bg-primary-600/20 rounded-xl flex items-center justify-center"
                >
                  <stat.icon className="w-6 h-6 text-primary-400" />
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={statsInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-4xl lg:text-5xl font-bold text-primary-500 mb-2"
                >
                  {stat.value}
                </motion.p>
                <p className="text-gray-400 text-sm">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section with Parallax */}
      <section ref={ctaRef} className="py-16 lg:py-24 bg-gray-50 relative overflow-hidden">
        {/* Parallax elements */}
        <motion.div
          style={{ 
            y: useTransform(scrollYProgress, [0.6, 1], [100, -50])
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full filter blur-3xl opacity-50"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2">
              {/* Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={ctaInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-gray-900 mb-4"
                >
                  ¿Necesitas ayuda con tu moto?
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={ctaInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 mb-8"
                >
                  Nuestro equipo está listo para ayudarte. Contáctanos vía WhatsApp o visítanos en Santiago.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href="https://wa.me/56912345678?text=Hola,%20necesito%20ayuda%20con%20mi%20moto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    Escribir por WhatsApp
                  </motion.a>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      to="/tienda"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all"
                    >
                      <FiPackage className="w-5 h-5" />
                      Ver Tienda
                    </Link>
                  </motion.div>
                </motion.div>
              </div>

              {/* Decoration */}
              <div className="hidden md:flex items-center justify-center p-8 bg-gradient-to-br from-primary-50 to-orange-50 relative overflow-hidden">
                <motion.div
                  animate={{ 
                    rotate: 360
                  }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #ef4444 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />
                <div className="text-center relative z-10">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-24 h-24 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center"
                  >
                    <FaMotorcycle className="w-12 h-12 text-primary-600" />
                  </motion.div>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <FiPhone className="w-5 h-5" />
                    <span>+56 9 1234 5678</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
