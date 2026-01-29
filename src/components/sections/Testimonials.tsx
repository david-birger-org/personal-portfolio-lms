"use client";

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

export function Testimonials() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Corporate Executive',
      image: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBvcnRyYWl0JTIwd29tYW58ZW58MXx8fHwxNzY5Njc5OTM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      content: 'Working with this coach has been life-changing. I lost 30 pounds in 4 months while gaining strength and confidence.',
      rating: 5,
      transformation: 'Lost 30 lbs in 4 months',
    },
    {
      name: 'Michael Chen',
      role: 'Entrepreneur',
      image: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBvcnRyYWl0JTIwbWFufGVufDF8fHx8MTc2OTY5ODAyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      content: 'The online coaching program fit perfectly into my busy schedule. The nutrition plan and workout routines were easy to follow.',
      rating: 5,
      transformation: 'Gained 15 lbs muscle',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Manager',
      image: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBvcnRyYWl0JTIwd29tYW58ZW58MXx8fHwxNzY5Njc5OTM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      content: 'I\'ve tried many trainers before, but this is the first time I\'ve seen sustainable results. The education provided goes beyond just workouts.',
      rating: 5,
      transformation: 'Body fat from 32% to 22%',
    },
    {
      name: 'David Thompson',
      role: 'Software Engineer',
      image: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBvcnRyYWl0JTIwbWFufGVufDF8fHx8MTc2OTY5ODAyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      content: 'The structured program and constant accountability kept me on track. I finally achieved the physique I\'ve always wanted.',
      rating: 5,
      transformation: 'Complete transformation',
    },
    {
      name: 'Jessica Martinez',
      role: 'Healthcare Professional',
      image: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBvcnRyYWl0JTIwd29tYW58ZW58MXx8fHwxNzY5Njc5OTM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      content: 'As a healthcare professional, I appreciate the scientific approach to training and nutrition. Every recommendation is backed by research.',
      rating: 5,
      transformation: 'Improved health metrics',
    },
    {
      name: 'Robert Williams',
      role: 'Business Owner',
      image: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBvcnRyYWl0JTIwbWFufGVufDF8fHx8MTc2OTY5ODAyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      content: 'The investment in personal coaching was worth every penny. Not only did I transform my body, but I also learned habits that will last a lifetime.',
      rating: 5,
      transformation: 'Lost 40 lbs in 6 months',
    },
  ];

  return (
    <section id="testimonials" className="py-32 md:py-40 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.span
            variants={fadeInUp}
            className="text-gray-600 font-medium text-sm uppercase tracking-wider"
          >
            Testimonials
          </motion.span>

          <motion.h2
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl mt-4 mb-6 text-gray-900 tracking-tight"
          >
            Success Stories from
            <br />
            <span className="text-gray-500">Real Clients</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-lg text-gray-600 leading-relaxed">
            Hear from clients who have transformed their lives through personalized coaching and dedication.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
              className="bg-gray-50 border border-gray-200 rounded-3xl p-8 hover:border-gray-300 transition-all duration-500 group"
            >
              <div className="relative mb-6">
                <Quote className="w-8 h-8 text-gray-400" />
              </div>

              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gray-900 text-gray-900" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="mb-6 inline-block">
                <span className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-medium text-gray-900">
                  {testimonial.transformation}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                <div className="w-12 h-12 rounded-2xl overflow-hidden ring-1 ring-gray-200">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 max-w-5xl mx-auto"
        >
          {[
            { number: '500+', label: 'Happy Clients' },
            { number: '98%', label: 'Success Rate' },
            { number: '10K+', label: 'Workouts Completed' },
            { number: '4.9/5', label: 'Average Rating' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="text-center p-8 bg-gray-50 border border-gray-200 rounded-3xl"
            >
              <div className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
