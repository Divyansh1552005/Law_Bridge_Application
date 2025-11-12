import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Play, Book, ExternalLink, Clock, User, Video } from 'lucide-react';
import preamble from '../assets/preamble.png';

export default function Resources() {
  const navigate = useNavigate();
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  
  const articles = [
    {
      title: "Fundamental Rights under the Indian Constitution",
      description: "Detailed breakdown of Part III (Articles 12–35): Right to Equality, Freedom, Exploitation, Religion, Cultural Rights, Remedies.",
      source: "Vajiram & Ravi",
      readTime: "10 min read",
      category: "Constitutional Law",
      url: "https://vajiramandravi.com/upsc-exam/fundamental-rights/",
      image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=240&fit=crop&crop=center"
    },
    {
      title: "Comprehensive Guide to Fundamental Rights with Case Laws",
      description: "Parent-wise summary of all fundamental rights, salient features, judicial interpretations including A.K. Gopalan to Kesavananda Bharati.",
      source: "iPleaders",
      readTime: "12 min read",
      category: "Constitutional Law",
      url: "https://blog.ipleaders.in/fundamental-rights-under-the-indian-constitution-a-comprehensive-guide-with-case-laws/",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=240&fit=crop&crop=center"
    },
    {
      title: "Fundamental Rights: Articles 12–35 of the Indian Constitution",
      description: "Concise overview of the six categories of fundamental rights and their significance in Indian democracy.",
      source: "GeeksforGeeks",
      readTime: "8 min read",
      category: "Constitutional Law",
      url: "https://www.geeksforgeeks.org/social-science/fundamental-rights/",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=240&fit=crop&crop=center"
    },
    {
      title: "New Rules for Divorce in India (2024–25): A Comprehensive Guide",
      description: "Explains divorce law updates, alimony, property rights, and how courts determine asset division.",
      source: "LegalKart",
      readTime: "10 min read",
      category: "Family Law",
      url: "https://www.legalkart.com/legal-blog/new-rules-for-divorce-in-india-2024-a-comprehensive-guide",
      image: "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=400&h=240&fit=crop&crop=center"
    },
    {
      title: "Divorce and Property Settlement in India: Key Legal Insights",
      description: "Overview of personal laws governing divorce and property allocation; identifies factors affecting equitable division.",
      source: "Raizada Law Associates",
      readTime: "9 min read",
      category: "Family Law",
      url: "https://www.raizadaassociates.com/blog/divorce-and-property-settlement/",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=240&fit=crop&crop=center"
    },
    {
      title: "Inheritance Rights After Divorce for Women and Children",
      description: "Discusses how divorce affects property and inheritance rights of women and children post-marital separation.",
      source: "India Law Offices",
      readTime: "7 min read",
      category: "Family Law",
      url: "https://www.indialawoffices.com/legal-articles/inheritance-rights-after-divorce-for-women-and-children",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=240&fit=crop&crop=center"
    },
    {
      title: "Understanding Property Division in Indian Divorce",
      description: "Guidelines on how marital property is distributed, depending on religion and asset type.",
      source: "LawChef",
      readTime: "8 min read",
      category: "Family Law",
      url: "https://www.lawchef.com/blogs/division-of-property-in-divorce",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=240&fit=crop&crop=center"
    },
    {
      title: "Joint Property After Divorce: A Complete Guide for Indian Couples",
      description: "Explores what qualifies as joint property, how equitable—not necessarily equal—division takes place based on financial contribution, duration of marriage, and future needs.",
      source: "LegalKart",
      readTime: "9 min read",
      category: "Family Law",
      url: "https://www.legalkart.com/legal-blog/joint-property-after-divorce-a-complete-guide-for-indian-couples",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=240&fit=crop&crop=center"
    },
    {
      title: "Property Rights of Married Women in India",
      description: "An exhaustive overview of property rights available to married women under different personal laws—Hindu, Muslim, Christian, and others.",
      source: "iPleaders",
      readTime: "10 min read",
      category: "Family Law",
      url: "https://blog.ipleaders.in/property-rights-of-married-women/",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=240&fit=crop&crop=center"
    },
  ];

  const videos = [
    {
      title: "IN-DEPTH: FUNDAMENTAL RIGHTS IN CONSTITUTION",
      description: "Comprehensive lecture on the Fundamental Rights under the Indian Constitution.",
      channel: "YouTube",
      url: "https://www.youtube.com/watch?v=l2fN9pbpa_s"
    },
    {
      title: "Fundamental Rights vs Directive Principles of State Policy",
      description: "A clear comparison between Fundamental Rights and Directive Principles.",
      channel: "YouTube",
      url: "https://www.youtube.com/watch?v=fXmY-meZ1tI"
    },
    {
      title: "Sansad TV Special Report: Fundamental Rights In ...",
      description: "Authoritative overview of the six Fundamental Rights by Sansad TV.",
      channel: "Rajya Sabha TV",
      url: "https://www.youtube.com/watch?v=7oJr6esvNh4"
    },
    {
      title: "Samvidhaan: The Making of the Constitution of India (Condensed)",
      description: "A condensed version of the celebrated mini-series on the making of the Constitution.",
      channel: "Rajya Sabha TV",
      url: "https://www.youtube.com/watch?v=PvULrpX0HtA"
    },
    {
      title: "Divorce: How To Protect Your Assets",
      description: "Practical guidance on safeguarding property during a divorce.",
      channel: "YouTube",
      url: "https://www.youtube.com/watch?v=31-MBm_SXDw"
    },
    {
      title: "Property division during divorce for Indian woman",
      description: "Explains how property is divided during divorce, especially from a woman's viewpoint.",
      channel: "YouTube",
      url: "https://www.youtube.com/watch?v=sPp8BhoCq_c"
    },
    {
      title: "Decoding Divorce: Expert Insights on Alimony and Property ...",
      description: "Expert breakdown of alimony and property-sharing law in India.",
      channel: "YouTube",
      url: "https://www.youtube.com/watch?v=e_DY-k3gcVM"
    },
    {
      title: "What Is Doctrine Of Basic Structure | UPSC Knowledge Nuggets",
      description: "Clarifies the Basic Structure Doctrine under the Indian Constitution.",
      channel: "YouTube",
      url: "https://www.youtube.com/watch?v=fXmY-meZ1tI"
    },
    {
      title: "Kesavananda Bharati Case 1973 | Basic Structure Doctrine ...",
      description: "Detailed explanation of the landmark Kesavananda Bharati case establishing the Basic Structure Doctrine.",
      channel: "YouTube",
      url: "https://www.youtube.com/watch?v=uPyrVW5yxxI"
    }
  ];

  const location = useLocation();

  const getEmbedUrl = (url) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleIframeLoad = () => {
    setLoadedCount(prev => {
      const newCount = prev + 1;
      if (newCount >= videos.length) {
        setTimeout(() => setVideosLoaded(true), 300);
      }
      return newCount;
    });
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none pt-8">
          <img 
            src={preamble} 
            alt="Indian Constitution Preamble" 
            className="opacity-20 max-w-4xl w-full h-auto object-contain select-none"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 drop-shadow-sm">
            Legal Resources & Learning
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-sm">
            Expand your understanding of Indian constitutional law with our curated collection of 
            articles, guides, and video resources from trusted legal experts and institutions.
          </p>
        </div>
      </div>

      {/* Articles Section */}
      <div id="articles" className="py-16 lg:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Guides & Articles
              </h2>
            </div>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              In-depth articles and comprehensive guides on Indian constitutional law, 
              fundamental rights, and landmark judicial decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <div 
                key={index}
                className="group bg-white rounded-3xl border-2 border-gray-100 overflow-hidden hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                onClick={() => window.open(article.url, '_blank')}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1.5 bg-white text-gray-900 text-xs font-bold rounded-full shadow-sm">
                      {article.category}
                    </span>
                  </div>
                  
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm flex items-center gap-1.5 font-medium">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-200">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">{article.source}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-600 group-hover:gap-2.5 transition-all">
                      <span className="text-sm font-semibold">Read</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Resources Section */}
      <div id="video-guides" className="py-16 lg:py-24 px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Play className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Video Resources
              </h2>
            </div>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Visual learning resources including lectures, case studies, and expert discussions 
              on constitutional law and legal principles.
            </p>
          </div>

          <div className="relative">
            {!videosLoaded && (
              <div className="absolute inset-0 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {videos.map((_, index) => (
                    <div key={`skeleton-${index}`} className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden animate-pulse">
                      <div className="aspect-video bg-gray-200 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 bg-gray-400 rounded-sm"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-3">
                        <div className="space-y-2">
                          <div className="h-5 bg-gray-200 rounded"></div>
                          <div className="h-5 bg-gray-100 rounded w-3/4"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-100 rounded"></div>
                          <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <div className="w-4 h-4 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-700 ${
              videosLoaded ? 'opacity-100' : 'opacity-0'
            }`}>
              {videos.map((video, index) => (
                <div key={index} className="bg-white rounded-3xl border-2 border-gray-100 overflow-hidden hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                  <div className="aspect-video relative">
                    <iframe
                      src={getEmbedUrl(video.url)}
                      title={video.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={handleIframeLoad}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {video.description}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Video className="w-4 h-4" />
                      <span className="text-sm font-medium">{video.channel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}