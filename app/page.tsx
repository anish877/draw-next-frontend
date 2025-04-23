'use client';
import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import ChalkHeading from "@/components/ChalkHeading";
import ChalkButton from "@/components/ChalkButton";
import ChalkFeature from "@/components/ChalkFeature";
import ChalkDrawing from "@/components/ChalkDrawing";
import { 
  Pencil, 
  MessageSquare, 
  Bot,
  Image as ImageIcon, 
  Shield,
  Github, 
  Twitter,
  Instagram, 
  Youtube,
  CheckCircle,
  ArrowRight,
  Globe
} from "lucide-react";

const Index = () => {
  const [dustElements, setDustElements] = useState<JSX.Element[]>([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Optimized chalk dust particles with throttling
  useEffect(() => {
    let lastScrollTime = 0;
    const throttleDelay = 200; // Increased delay for better performance
    
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime > throttleDelay && Math.random() > 0.92) { // Reduced particle generation
        lastScrollTime = now;
        
        const newDust = (
          <div
            key={now}
            className="chalk-dust animate-chalk-dust"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${1.2 + Math.random() * 1.3}s`, // Slightly slower animation
              width: `${1 + Math.random() * 1}px`, // More consistent size
              height: `${1 + Math.random() * 1}px`,
              opacity: 0.3, // Reduced opacity for subtlety
            }}
          />
        );
        
        setDustElements(prev => [...prev, newDust]);
        
        // Clean up dust elements after animation
        setTimeout(() => {
          setDustElements(prev => prev.filter(item => item.key !== newDust.key));
        }, 2500);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex(prev => (prev + 1) % testimonials.length);
    }, 7000); // Slightly longer time for better readability
    
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      quote: "Sketch Board has transformed how our design team collaborates with clients. The real-time feedback has cut our revision cycles in half.",
      author: "Sarah Johnson",
      position: "Creative Director",
      company: "Artisan Studios"
    },
    {
      quote: "The AI-powered figure generation has been a game-changer for quickly visualizing concepts during our brainstorming sessions.",
      author: "Michael Chen",
      position: "Product Manager",
      company: "InnovateTech"
    },
    {
      quote: "As a remote team spanning three continents, Sketch Board has become our virtual whiteboard. It's essential to our workflow.",
      author: "Emma Rodriguez",
      position: "UX Lead",
      company: "Global Design Co."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for individuals and small projects",
      features: [
        "Up to 3 active boards",
        "Basic drawing tools",
        "Limited AI assistance",
        "1 collaborator per board",
        "7-day history"
      ]
    },
    {
      name: "Professional",
      price: "$12",
      period: "per month",
      popular: true,
      description: "Ideal for creative professionals and small teams",
      features: [
        "Unlimited boards",
        "Advanced drawing tools",
        "Full AI capabilities",
        "Up to 10 collaborators per board",
        "30-day history",
        "Custom export options"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for large organizations",
      features: [
        "Everything in Professional",
        "Unlimited collaborators",
        "SSO integration",
        "Admin dashboard",
        "Dedicated support",
        "API access"
      ]
    }
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Chalk dust container - minimal for professional look */}
      <div className="chalk-dust-container fixed inset-0 opacity-15 pointer-events-none z-0">
        {dustElements}
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <nav className="flex justify-between items-center mb-16 md:mb-24">
          <div className="font-semibold text-2xl tracking-tight text-slate-800">
            <span className="font-chalk">Sketch</span>
            <span className="font-sans font-medium">Board</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium text-sm">
            <a href="#features" className="hover:text-blue-600 transition-colors duration-200">Features</a>
            <a href="#testimonials" className="hover:text-blue-600 transition-colors duration-200">Testimonials</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors duration-200">Pricing</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors duration-200">FAQ</a>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/auth/login">
              <ChalkButton variant="outline" className="px-3 md:px-4 py-2 text-sm font-medium text-slate-700 border-slate-300 hover:bg-slate-100 transition-colors duration-200">Log In</ChalkButton>
            </Link>
            <Link href="/auth/signup">
              <ChalkButton variant="blue" className="px-3 md:px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200">Sign Up</ChalkButton>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-8 md:py-16 lg:py-20 flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-3 py-1 mb-4 border border-blue-200 bg-blue-50 rounded-full">
              <span className="text-xs md:text-sm font-medium text-blue-700">Enterprise-Ready Collaboration</span>
            </div>
            <ChalkHeading as="h1" className="text-4xl md:text-5xl lg:text-6xl mb-6 text-slate-800 font-bold leading-tight tracking-tight">
              Visual Collaboration for Modern Teams
            </ChalkHeading>
            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Empower your team with a secure, professional platform that combines real-time drawing, communication, and AI assistance.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="/auth/signup">
                <ChalkButton className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 shadow-sm">
                  <span>Start Free Trial</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </ChalkButton>
              </Link>
              <ChalkButton variant="outline" className="px-5 py-3 text-slate-700 border-slate-300 hover:bg-slate-100 transition-colors duration-200">Request Demo</ChalkButton>
            </div>
            <div className="mt-8 flex items-center justify-center md:justify-start text-sm text-slate-500">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>No credit card required</span>
              <span className="mx-3 text-slate-300">•</span>
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>14-day free trial</span>
            </div>
          </div>
          <div className="flex-1 relative bg-white p-6 rounded-xl shadow-lg border border-slate-100 transform hover:translate-y-[-4px] transition-transform duration-300">
            <ChalkDrawing />
          </div>
        </section>
      </header>

      {/* Stats Section */}
      <section className="bg-slate-100 py-12 md:py-16 relative z-10 border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="font-bold text-3xl md:text-4xl text-blue-600 mb-2">10K+</div>
              <div className="text-slate-600 font-medium text-sm">Active Users</div>
            </div>
            <div className="p-4">
              <div className="font-bold text-3xl md:text-4xl text-blue-600 mb-2">500+</div>
              <div className="text-slate-600 font-medium text-sm">Enterprise Clients</div>
            </div>
            <div className="p-4">
              <div className="font-bold text-3xl md:text-4xl text-blue-600 mb-2">99.9%</div>
              <div className="text-slate-600 font-medium text-sm">Uptime</div>
            </div>
            <div className="p-4">
              <div className="font-bold text-3xl md:text-4xl text-blue-600 mb-2">4.8/5</div>
              <div className="text-slate-600 font-medium text-sm">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 md:py-24 relative z-10" id="features">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <ChalkHeading className="text-3xl md:text-4xl mb-6 text-slate-800 font-bold tracking-tight">
              Enterprise-Grade Collaboration Platform
            </ChalkHeading>
            <p className="text-lg text-slate-600 leading-relaxed">
              Built for teams that demand security, performance, and intuitive design.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <ChalkFeature
              icon={Pencil}
              title="Real-time Multiplayer Drawing"
              description="Collaborate seamlessly with zero-latency drawing tools optimized for professional use cases."
              index={0}
              iconColor="text-blue-600"
              className="bg-slate-50 p-6 md:p-8 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            />
            <ChalkFeature
              icon={MessageSquare}
              title="Integrated Communication"
              description="Built-in messaging, commenting, and video conferencing to streamline decision-making."
              index={1}
              iconColor="text-blue-600"
              className="bg-slate-50 p-6 md:p-8 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            />
            <ChalkFeature
              icon={Bot}
              title="AI-Powered Assistance"
              description="Generate professional diagrams, flowcharts and visualizations with advanced AI capabilities."
              iconColor="text-blue-600"
              index={2}
              className="bg-slate-50 p-6 md:p-8 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            />
            <ChalkFeature
              icon={ImageIcon}
              title="Infinite Canvas"
              description="Expandable workspace with enterprise-grade performance, even for complex projects."
              index={3}
              iconColor="text-blue-600"
              className="bg-slate-50 p-6 md:p-8 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            />
            <ChalkFeature
              icon={Shield}
              title="Enterprise Security"
              description="SOC 2 and GDPR compliant with end-to-end encryption and role-based access controls."
              index={4}
              iconColor="text-blue-600"
              className="bg-slate-50 p-6 md:p-8 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            />
            <ChalkFeature
              icon={Globe}
              title="Global Accessibility"
              description="Cloud-based solution accessible from any device with 99.9% uptime and data replication."
              index={5}
              iconColor="text-blue-600"
              className="bg-slate-50 p-6 md:p-8 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-slate-50 py-16 md:py-24 relative z-10 border-t border-slate-200" id="testimonials">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <ChalkHeading className="text-3xl md:text-4xl mb-6 text-slate-800 font-bold tracking-tight">
              Trusted by Industry Leaders
            </ChalkHeading>
            <p className="text-lg text-slate-600 leading-relaxed">
              See how organizations are transforming their collaboration with SketchBoard
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 relative">
              <div className="text-blue-600 text-6xl font-serif absolute top-6 left-6 opacity-20">"</div>
              <div className="relative z-10">
                <p className="text-lg md:text-xl text-slate-700 mb-8 leading-relaxed font-medium">
                  {testimonials[testimonialIndex].quote}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {testimonials[testimonialIndex].author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-slate-800">{testimonials[testimonialIndex].author}</div>
                    <div className="text-slate-500 text-sm">{testimonials[testimonialIndex].position}, {testimonials[testimonialIndex].company}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 gap-3">
              {testimonials.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${idx === testimonialIndex ? 'bg-blue-600' : 'bg-slate-300'}`}
                  aria-label={`View testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="bg-white p-4 rounded-lg flex items-center justify-center h-16 shadow-sm">
              <div className="text-lg font-bold text-slate-400">ACME Corp</div>
            </div>
            <div className="bg-white p-4 rounded-lg flex items-center justify-center h-16 shadow-sm">
              <div className="text-lg font-bold text-slate-400">TechGlobal</div>
            </div>
            <div className="bg-white p-4 rounded-lg flex items-center justify-center h-16 shadow-sm">
              <div className="text-lg font-bold text-slate-400">InnovateCo</div>
            </div>
            <div className="bg-white p-4 rounded-lg flex items-center justify-center h-16 shadow-sm">
              <div className="text-lg font-bold text-slate-400">FutureSys</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-16 md:py-24 relative z-10" id="pricing">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <ChalkHeading className="text-3xl md:text-4xl mb-6 text-slate-800 font-bold tracking-tight">
              Transparent Pricing Plans
            </ChalkHeading>
            <p className="text-lg text-slate-600 leading-relaxed">
              Choose the plan that's right for your team — all with no hidden fees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl ${plan.popular ? 'border-2 border-blue-500 shadow-lg relative transform hover:translate-y-[-4px]' : 'border border-slate-200 shadow-sm hover:shadow-md'} p-8 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-xl font-bold text-slate-800 mb-2">{plan.name}</div>
                <div className="flex items-end mb-6">
                  <div className="text-4xl font-bold text-slate-800">{plan.price}</div>
                  {plan.period && <div className="text-slate-500 ml-1 mb-1">{plan.period}</div>}
                </div>
                <p className="text-slate-600 mb-6">{plan.description}</p>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <ChalkButton 
                  className={`w-full py-3 text-center font-medium transition-colors duration-200 ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {index === 2 ? 'Contact Sales' : 'Get Started'}
                </ChalkButton>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-500">
              Need a custom solution? <a href="#" className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200">Contact our sales team</a>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 py-16 md:py-24 relative z-10 border-t border-slate-200" id="faq">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <ChalkHeading className="text-3xl md:text-4xl mb-6 text-slate-800 font-bold tracking-tight">
              Frequently Asked Questions
            </ChalkHeading>
            <p className="text-lg text-slate-600 leading-relaxed">
              Find answers to the most common questions about SketchBoard
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4 md:space-y-6">
              {[
                {
                  question: "How secure is SketchBoard for enterprise use?",
                  answer: "SketchBoard is built with enterprise-grade security. We offer SOC 2 Type II compliance, end-to-end encryption, and role-based access controls. All data is stored in secure, redundant data centers with regular security audits."
                },
                {
                  question: "Can SketchBoard integrate with our existing tools?",
                  answer: "Yes, SketchBoard offers robust API integrations with popular enterprise tools including Slack, Microsoft Teams, Jira, Asana, and more. We also support SSO with Okta, Azure AD, and Google Workspace."
                },
                {
                  question: "What kind of support is included?",
                  answer: "All plans include email support. Professional plans include priority email support with 24-hour response times. Enterprise plans include dedicated account management, phone support, and guaranteed SLAs."
                },
                {
                  question: "Is SketchBoard accessible on mobile devices?",
                  answer: "Yes, SketchBoard is fully responsive and works on all modern devices including desktops, laptops, tablets, and smartphones. We also offer native iOS and Android apps for enhanced mobile experience."
                },
                {
                  question: "How does the AI assistant work?",
                  answer: "Our AI assistant can generate diagrams, flowcharts, and visual elements based on text prompts. It can also help organize content, suggest improvements to diagrams, and transcribe handwritten notes into digital text."
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 transition-shadow duration-300 hover:shadow-md">
                  <h3 className="text-lg font-medium text-slate-800 mb-3">{item.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ChalkHeading className="text-3xl sm:text-4xl mb-6 text-white font-bold">
            Transform How Your Team Collaborates
          </ChalkHeading>
          <p className="text-xl text-blue-100 mb-8 max-w-xl mx-auto font-light">
            Join 500+ leading organizations already using SketchBoard
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ChalkButton className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-medium text-lg shadow-sm transition-colors duration-200">
              Start Free Trial
            </ChalkButton>
            <ChalkButton variant="outline" className="px-8 py-4 border-white text-white hover:bg-blue-500 font-medium text-lg transition-colors duration-200">
              Schedule Demo
            </ChalkButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12 sm:py-16 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div>
              <div className="font-bold text-xl tracking-tight mb-4">
                <span className="font-chalk">Sketch</span>
                <span className="font-sans">Board</span>
              </div>
              <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                The professional platform for visual collaboration and ideation.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-300 hover:text-white transition-colors duration-200">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors duration-200">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors duration-200">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors duration-200">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Product</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Enterprise</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Tutorials</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-200">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Partners</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Legal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} SketchBoard. All rights reserved.
            </p>
            <div className="flex mt-4 md:mt-0 gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;