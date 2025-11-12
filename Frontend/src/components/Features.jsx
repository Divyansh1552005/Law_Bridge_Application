import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Upload, MessageSquare, Video, ArrowRight } from 'lucide-react';

export default function Features() {
  const navigate = useNavigate();

  const handleNavigation = (path, isExternal = false) => {
    if (isExternal) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: "Legal Blog & Insights",
      description: "Access real legal stories, expert articles, and community discussions to stay informed about legal trends and precedents.",
      action: "Explore Articles",
      color: "blue",
      path: "https://blogspace-alpha.vercel.app/",
      isExternal: true
    },
    {
      icon: Upload,
      title: "Video Meeting Based Appointments",
      description: "Schedule and attend secure video consultations with qualified lawyers from the comfort of your home or office.",
      action: "Book Video Meeting",
      color: "emerald",
      path: "/lawyers",
      isExternal: false
    },
    {
      icon: MessageSquare,
      title: "AI Legal Assistant",
      description: "Get instant answers to legal questions, understand your rights, and receive guidance on everyday legal matters through our intelligent chatbot.",
      action: "Start Conversation",
      color: "violet",
      path: "/chatbot",
      isExternal: false
    },
    {
      icon: Video,
      title: "Learning Resources",
      description: "Access curated video guides, legal tutorials, and educational content to build your understanding of law and legal processes.",
      action: "Browse Resources",
      color: "amber",
      path: "/resources",
      isExternal: false
    }
  ];

  const colorClasses = {
    blue: {
      gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      hoverBorder: "hover:border-blue-500/30",
      actionColor: "text-blue-500",
      shadow: "hover:shadow-blue-500/5"
    },
    emerald: {
      gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      hoverBorder: "hover:border-emerald-500/30",
      actionColor: "text-emerald-500",
      shadow: "hover:shadow-emerald-500/5"
    },
    violet: {
      gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
      hoverBorder: "hover:border-violet-500/30",
      actionColor: "text-violet-500",
      shadow: "hover:shadow-violet-500/5"
    },
    amber: {
      gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      hoverBorder: "hover:border-amber-500/30",
      actionColor: "text-amber-500",
      shadow: "hover:shadow-amber-500/5"
    }
  };

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Comprehensive Legal Tools
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Everything you need to understand, navigate, and resolve legal matters with confidence and clarity
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorClasses[feature.color];
            
            return (
              <div
                key={index}
                onClick={() => handleNavigation(feature.path, feature.isExternal)}
                className={`group relative bg-white border-2 border-gray-100 rounded-3xl p-8 transition-all duration-300 cursor-pointer overflow-hidden ${colors.hoverBorder} hover:shadow-xl ${colors.shadow} hover:-translate-y-1`}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative flex items-start gap-5">
                  {/* Icon */}
                  <div className={`flex-shrink-0 p-4 ${colors.iconBg} rounded-2xl transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`w-7 h-7 ${colors.iconColor}`} />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-5">
                      {feature.description}
                    </p>
                    
                    {/* Action Link */}
                    <div className={`flex items-center ${colors.actionColor} font-semibold text-sm group/link`}>
                      <span>{feature.action}</span>
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/link:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

