import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import NavigationTabs from "../components/NavigationTabs";
import { Helmet } from "react-helmet-async";
import { Suspense, lazy } from "react";
import nangaParbat from "../assets/nanga_parbat.jpg";
import mountainRoad from "../assets/mountain_road.jpg";

const InteractiveMap = lazy(() => import("../components/InteractiveMap"));

import {
  MapPin,
  Search,
  Share2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  Filter,
  ArrowRight,
  Send,
  Sparkles,
  Map as MapIcon,
  Compass,
  AlertCircle,
  WifiOff,
} from "lucide-react";


const INITIAL_UPDATES = [
  {
    id: "1",
    userName: "Shahid Khan",
    avatarInitials: "SK",
    location: "Hunza Valley, Gilgit-Baltistan (GB)",
    category: "Mountains",
    timeAgo: "10m ago",
    updateText:
      "Karakoram Highway near Attabad Lake is fully clear. Weather is sunny but cold. Traffic is moving smoothly in both directions.",
    imageUrl:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80",
    upvotes: 24,
    downvotes: 1,
    commentsCount: 5,
    status: "Opened",
    comments: [
      {
        id: "c1",
        user: "Zeeshan",
        text: "Passed by 30 mins ago, can confirm it is completely clear!",
      },
      {
        id: "c2",
        user: "Noreen",
        text: "Perfect! Traveling to Hunza tonight.",
      },
    ],
  },
  {
    id: "2",
    userName: "Ayesha Ahmed",
    avatarInitials: "AA",
    location: "Murree, Punjab",
    category: "Cities",
    timeAgo: "45m ago",
    updateText:
      "Heavy snow accumulation near Mall Road. Roads are extremely slippery. Authorities are clearing the snow but expect slow-moving traffic. Avoid non-essential travel.",
    imageUrl:
      "https://images.unsplash.com/photo-1616036740257-9449ea1f6605?auto=format&fit=crop&w=600&q=80",
    upvotes: 42,
    downvotes: 3,
    commentsCount: 12,
    status: "Closed",
    comments: [
      {
        id: "c3",
        user: "Bilal",
        text: "Are winter tires required? I am stuck near Expressway.",
      },
      {
        id: "c4",
        user: "Ayesha",
        text: "Yes Bilal, tires chains are absolutely necessary right now.",
      },
    ],
  },
  {
    id: "3",
    userName: "Zainab Malik",
    avatarInitials: "ZM",
    location: "Gwadar, Balochistan",
    category: "Beaches",
    timeAgo: "2h ago",
    updateText:
      "Beautiful sunset view from Hammerhead, Gwadar. Coastline is peaceful. Perfect time for beach strolls. Wind speed is moderate.",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    upvotes: 18,
    downvotes: 0,
    commentsCount: 2,
    status: "Opened",
    comments: [],
  },
  {
    id: "4",
    userName: "Imran Raza",
    avatarInitials: "IR",
    location: "Neelum Valley, Azad Kashmir (AJK)",
    category: "Valleys",
    timeAgo: "4h ago",
    updateText:
      "Minor landslide reported near Keran. Road is partially blocked. One-way traffic is active. Use caution while driving along the river bend.",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    upvotes: 31,
    downvotes: 2,
    commentsCount: 8,
    status: "Closed",
    comments: [
      { id: "c5", user: "Kamran", text: "Is the road clearance crew on site?" },
      {
        id: "c6",
        user: "Imran",
        text: "Yes, local machinery is active, expecting complete clearance by nightfall.",
      },
    ],
  },
  {
    id: "5",
    userName: "Fatima Noor",
    avatarInitials: "FN",
    location: "Banjosa Lake, Azad Kashmir (AJK)",
    category: "Lakes",
    timeAgo: "6h ago",
    updateText:
      "Banjosa Lake resort area is serene today. Boating services are fully operational. Water level is stable and weather is perfect for family picnics.",
    imageUrl:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
    upvotes: 15,
    downvotes: 0,
    commentsCount: 1,
    status: "Opened",
    comments: [],
  },
  {
    id: "6",
    userName: "Bilal Dar",
    avatarInitials: "BD",
    location: "Ranikot Fort, Sindh",
    category: "Heritage",
    timeAgo: "1d ago",
    updateText:
      "Exploring the Great Wall of Sindh. Roads from Sann are in decent condition but dusty. Bring plenty of water as there are no shops inside the fort premises.",
    imageUrl:
      "https://images.unsplash.com/photo-1599341951474-275f8526a21b?auto=format&fit=crop&w=600&q=80",
    upvotes: 29,
    downvotes: 1,
    commentsCount: 4,
    status: "Opened",
    comments: [],
  },
];

const MAP_HOTSPOTS = [
  {
    id: "h1",
    name: "Hunza Valley",
    coordinates: [36.3167, 74.65],
    status: "Opened",
    weather: "Sunny, 12°C",
    alert:
      "Roads fully operational. Heavy tourist influx. Perfect scenic visibility.",
    lastUpdated: "10m ago",
  },
  {
    id: "h2",
    name: "Murree",
    coordinates: [33.907, 73.3943],
    status: "Closed",
    weather: "Heavy Snow, -1°C",
    alert:
      "Extreme snow. Galyat roads blocked. Entry of non-locals restricted.",
    lastUpdated: "45m ago",
  },
  {
    id: "h3",
    name: "Kalam Valley",
    coordinates: [35.4906, 72.5796],
    status: "Opened",
    weather: "Clear, 16°C",
    alert: "Bypass road is functional. Minor potholes near Bahrain, Swat.",
    lastUpdated: "2h ago",
  },
  {
    id: "h4",
    name: "Gwadar",
    coordinates: [25.1216, 62.3254],
    status: "Opened",
    weather: "Warm, 32°C",
    alert: "Coastal Highway is fully operational. Calm winds at the beach.",
    lastUpdated: "2h ago",
  },
  {
    id: "h5",
    name: "Neelum Valley",
    coordinates: [34.5805, 73.907],
    status: "Closed",
    weather: "Rainy, 14°C",
    alert: "Landslide near Keran. Road closed for clearing. Avoid travel.",
    lastUpdated: "4h ago",
  },
  {
    id: "h6",
    name: "Gorakh Hill",
    coordinates: [26.8931, 67.1561],
    status: "Opened",
    weather: "Windy, 22°C",
    alert:
      "Access road clear. Advisable to climb before sunset due to steep turns.",
    lastUpdated: "6h ago",
  },
];

const CATEGORIES = [
  "All",
  "Mountains",
  "Heritage",
  "Valleys",
  "Beaches",
  "Cities",
  "Lakes",
];


export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatesList, setUpdatesList] = useState(INITIAL_UPDATES);
  const [selectedHotspot, setSelectedHotspot] = useState(MAP_HOTSPOTS[0]);
  const [userVotes, setUserVotes] = useState({});
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [activeCommentsSection, setActiveCommentsSection] = useState(null);

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const scrolled = activeSectionIndex > 0;

  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const currentIndexRef = useRef(0);
  const animatingRef = useRef(false);

  const goToSection = (index, direction) => {
    if (index < 0 || index >= sectionsRef.current.length) return;

    animatingRef.current = true;
    const currentEl = sectionsRef.current[currentIndexRef.current];
    const nextEl = sectionsRef.current[index];
    const dir =
      direction !== undefined
        ? direction
        : index > currentIndexRef.current
          ? 1
          : -1;

    const tl = gsap.timeline({
      onComplete: () => {
        if (currentIndexRef.current !== index) {
          gsap.set(sectionsRef.current[currentIndexRef.current], {
            visibility: "hidden",
          });
        }
        currentIndexRef.current = index;
        setActiveSectionIndex(index);
        animatingRef.current = false;
      },
    });

    if (dir > 0) {
      gsap.set(nextEl, { yPercent: 100, zIndex: 2, visibility: "visible" });
      gsap.set(currentEl, { zIndex: 1 });

      tl.to(currentEl, {
        yPercent: -30,
        scale: 0.95,
        opacity: 0.5,
        duration: 0.8,
        ease: "power2.inOut",
      });

      tl.to(
        nextEl,
        {
          yPercent: 0,
          duration: 0.8,
          ease: "power2.inOut",
        },
        0,
      );
    } else {
      gsap.set(nextEl, { zIndex: 1, visibility: "visible" });
      gsap.set(currentEl, { zIndex: 2 });

      tl.to(currentEl, {
        yPercent: 100,
        duration: 0.8,
        ease: "power2.inOut",
      });

      tl.fromTo(
        nextEl,
        {
          yPercent: -30,
          scale: 0.95,
          opacity: 0.5,
        },
        {
          yPercent: 0,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power2.inOut",
        },
        0,
      );
    }

    const animateElements = nextEl.querySelectorAll(".animate-on-scroll");
    if (animateElements.length > 0) {
      tl.fromTo(
        animateElements,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.4",
      );
    }

    if (index === 3) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 400);
    }

    const tabIdMap = ["hero", "features", "feed", "map", "", "faq"];
    if (tabIdMap[index] !== undefined) {
      setActiveTab(tabIdMap[index]);
    }
  };

  useGSAP(
    () => {
      if (containerRef.current) {
        sectionsRef.current = Array.from(
          containerRef.current.querySelectorAll(".section-panel"),
        );
        gsap.set(sectionsRef.current, { yPercent: 100, visibility: "hidden" });
        gsap.set(sectionsRef.current[0], {
          yPercent: 0,
          visibility: "visible",
        });
      }
    },
    { scope: containerRef },
  );

  const handleScrollOrWheel = (event, direction) => {
    let target = event.target;
    let scrollable = null;

    while (
      target &&
      target instanceof Element &&
      target !== containerRef.current
    ) {
      if (target.classList.contains("scrollbar-thin")) {
        scrollable = target;
        break;
      }
      target = target.parentNode;
    }

    if (scrollable) {
      if (direction > 0) {
        const isAtBottom =
          scrollable.scrollTop + scrollable.clientHeight >=
          scrollable.scrollHeight - 2;
        if (!isAtBottom) {
          return;
        }
      } else {
        const isAtTop = scrollable.scrollTop <= 2;
        if (!isAtTop) {
          return;
        }
      }
    }

    if (event.cancelable) {
      event.preventDefault();
    }

    if (!animatingRef.current) {
      const nextIndex = currentIndexRef.current + direction;
      if (nextIndex >= 0 && nextIndex < sectionsRef.current.length) {
        goToSection(nextIndex, direction);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;

    const handleWheel = (e) => {
      const direction = e.deltaY > 0 ? 1 : -1;
      handleScrollOrWheel(e, direction);
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (touchStartY === 0) return;
      const touchEndY = e.touches[0].clientY;
      const diff = touchStartY - touchEndY;

      if (Math.abs(diff) > 50) {
        const direction = diff > 0 ? 1 : -1;
        handleScrollOrWheel(e, direction);
        touchStartY = 0;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        if (
          !animatingRef.current &&
          currentIndexRef.current < sectionsRef.current.length - 1
        ) {
          goToSection(currentIndexRef.current + 1, 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        if (!animatingRef.current && currentIndexRef.current > 0) {
          goToSection(currentIndexRef.current - 1, -1);
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        if (!animatingRef.current) {
          goToSection(0, -1);
        }
      } else if (e.key === "End") {
        e.preventDefault();
        if (!animatingRef.current) {
          goToSection(sectionsRef.current.length - 1, 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavClick = (e, targetId) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    setMobileMenuOpen(false);
    const sectionIdMap = ["hero", "features", "feed", "map", "steps", "faq"];
    const targetIndex = sectionIdMap.indexOf(targetId);
    if (targetIndex !== -1 && targetIndex !== currentIndexRef.current) {
      const dir = targetIndex > currentIndexRef.current ? 1 : -1;
      goToSection(targetIndex, dir);
    }
  };

  const handleVote = (id, type) => {
    const currentVote = userVotes[id];
    setUpdatesList((prevList) =>
      prevList.map((item) => {
        if (item.id !== id) return item;

        let upvoteDiff = 0;
        let downvoteDiff = 0;

        if (currentVote === type) {
          if (type === "up") upvoteDiff = -1;
          if (type === "down") downvoteDiff = -1;
          setUserVotes((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
          });
        } else {
          if (currentVote === "up") upvoteDiff = -1;
          if (currentVote === "down") downvoteDiff = -1;

          if (type === "up") upvoteDiff = 1;
          if (type === "down") downvoteDiff = 1;

          setUserVotes((prev) => ({ ...prev, [id]: type }));
        }

        return {
          ...item,
          upvotes: item.upvotes + upvoteDiff,
          downvotes: item.downvotes + downvoteDiff,
        };
      }),
    );
  };

  const handleAddComment = (id) => {
    const commentText = commentInputs[id];
    if (!commentText || !commentText.trim()) return;

    setUpdatesList((prevList) =>
      prevList.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          commentsCount: item.commentsCount + 1,
          comments: [
            ...item.comments,
            {
              id: `c-user-${Date.now()}`,
              user: "You",
              text: commentText,
            },
          ],
        };
      }),
    );

    setCommentInputs((prev) => ({ ...prev, [id]: "" }));
  };

  const filteredUpdates = updatesList.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.updateText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const faqs = [
    {
      q: "What is Waypulse and how does it work?",
      a: "Waypulse is a crowd-sourced travel companion platform that allows travelers to post real-time updates on road conditions, weather, traffic, blockages, and landslide activities in tourist destinations across Pakistan. The community upvotes relevant updates to keep them on the top, ensuring you always get accurate, current updates.",
    },
    {
      q: "How can I post an update?",
      a: "You can download the Waypulse mobile app, sign up for a free account, and click the post icon. You can select your province, city/destination, choose a category (Mountains, Valleys, Heritage, Lakes, etc.), write a brief description of the current status, snap a live photo, and mark it as 'Opened' (accessible) or 'Closed' (blocked).",
    },
    {
      q: "How does the app prevent spam and fake updates?",
      a: "We use a multi-tiered validation approach. First, other active travelers nearby can upvote or downvote reports based on their first-hand observations. Second, updates must include a photo taken within the coordinates of the location. Finally, admin moderators review flagged posts to remove spam immediately.",
    },
    {
      q: "Does Waypulse require an active internet connection?",
      a: "While posting requires internet, the Waypulse app caches the latest updates and map checkpoints offline. This means if you lose signal in deep valleys, you can still view previously loaded route maps and critical warnings.",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans selection:bg-primary/20 selection:text-primary"
    >
      <Helmet>
        <title>Waypulse — Live Crowd-Sourced Travel & Route Updates</title>
        <meta name="description" content="Get real-time crowd-sourced road conditions, route updates, weather reports, and crowd ingestion for tourist destinations in Pakistan." />
        <link rel="canonical" href="https://waypulse-web.onrender.com/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://waypulse-web.onrender.com/#website",
                "url": "https://waypulse-web.onrender.com/",
                "name": "Waypulse",
                "description": "Real-Time Crowd-Sourced Pakistan Travel & Route Updates"
              },
              {
                "@type": "Organization",
                "@id": "https://waypulse-web.onrender.com/#organization",
                "name": "Waypulse",
                "url": "https://waypulse-web.onrender.com/",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://waypulse-web.onrender.com/favicon.svg"
                },
                "sameAs": ["https://github.com/HF-Gig/waypulse-web"]
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://waypulse-web.onrender.com/#softwareapp",
                "name": "Waypulse Mobile App",
                "operatingSystem": "Android, iOS",
                "applicationCategory": "TravelApplication",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "downloadUrl": "https://waypulse-web.onrender.com/waypulse-app.aab"
              },
              {
                "@type": "FAQPage",
                "@id": "https://waypulse-web.onrender.com/#faq",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How can I post an update?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "You can download the Waypulse mobile app, sign up for a free account, and click the post icon. You can select your province, city/destination, choose a category (Mountains, Valleys, Heritage, Lakes, etc.), write a brief description of the current status, snap a live photo, and mark it as 'Opened' (accessible) or 'Closed' (blocked)."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How does the app prevent spam and fake updates?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "We use a multi-tiered validation approach. First, other active travelers nearby can upvote or downvote reports based on their first-hand observations. Second, updates must include a photo taken within the coordinates of the location. Finally, admin moderators review flagged posts to remove spam immediately."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Does Waypulse require an active internet connection?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "While posting requires internet, the Waypulse app caches the latest updates and map checkpoints offline. This means if you lose signal in deep valleys, you can still view previously loaded route maps and critical warnings."
                    }
                  }
                ]
              }
            ]
          })}
        </script>
      </Helmet>

      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 bg-transparent ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <span
                onClick={(e) => handleNavClick(e, "hero")}
                className="font-display font-extrabold text-2xl tracking-tight text-slate-900 cursor-pointer"
              >
                Waypulse
              </span>
            </div>
          </div>

          <NavigationTabs activeTab={activeTab} onTabClick={handleNavClick} />

          <div className="hidden md:flex items-center gap-4">
            <a
              href="/waypulse-app.aab"
              download="waypulse-app.aab"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 h-11 rounded-full shadow-lg transform hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download App
            </a>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="p-2.5 rounded-full bg-white/50 backdrop-blur-md border border-white/50 text-slate-800 shadow-sm cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 border-b border-slate-200 py-4 px-6 space-y-4 animate-fade-in backdrop-blur-lg">
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, "features")}
              className="block text-base font-semibold text-slate-600"
            >
              Features
            </a>
            <a
              href="#feed"
              onClick={(e) => handleNavClick(e, "feed")}
              className="block text-base font-semibold text-slate-600"
            >
              Live Updates
            </a>
            <a
              href="#map"
              onClick={(e) => handleNavClick(e, "map")}
              className="block text-base font-semibold text-slate-600"
            >
              Interactive Map
            </a>
            <a
              href="#faq"
              onClick={(e) => handleNavClick(e, "faq")}
              className="block text-base font-semibold text-slate-600"
            >
              FAQs
            </a>
            <a
              href="/waypulse-app.aab"
              download="waypulse-app.aab"
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-full font-semibold shadow-md"
            >
              <Download className="w-4 h-4" /> Download App
            </a>
          </div>
        )}
      </header>

      <main className="absolute inset-0 z-0">
        <section className="section-panel relative h-full flex items-center justify-center overflow-hidden">
        {/* Background Image of Nanga Parbat */}
        <div className="absolute inset-0 z-0">
          <img
            src={nangaParbat}
            alt="Nanga Parbat"
            className="w-full h-full object-cover object-center opacity-40 select-none pointer-events-none"
          />
          {/* Gradients and filters to blend it beautifully with the design and preserve text readability */}
          <div className="absolute inset-0 bg-linear-to-b from-white/30 via-transparent to-slate-50 z-0"></div>
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px] z-0"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60 z-0"></div>

        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute top-64 right-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7 text-center lg:text-left animate-on-scroll">
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-slate-900 mb-6">
                Tourism Places Updates
                <br />{" "}
                <span className="text-transparent bg-clip-text bg-primary">
                  In Your Pocket.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                Waypulse connects travelers across Pakistan. Share live updates,
                get route blockages, check actual spot weather, and travel with
                confidence. 100% crowd-verified.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <a
                  href="#feed"
                  onClick={(e) => handleNavClick(e, "feed")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 h-13 rounded-full transition-all shadow-md cursor-pointer"
                >
                  Explore Live Feed <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/waypulse-app.aab"
                  download="waypulse-app.aab"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-semibold px-8 h-13 rounded-full transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-primary" /> Get App
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-8 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="font-display font-extrabold text-2xl sm:text-3xl text-primary">
                    1+
                  </p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                    Active Users
                  </p>
                </div>
                <div>
                  <p className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                    7+
                  </p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                    Weekly Reports
                  </p>
                </div>
                <div>
                  <p className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-500">
                    100%
                  </p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                    Accuracy Rate
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[380px] lg:min-h-[450px] animate-on-scroll">
              <div className="absolute w-72 h-72 bg-gradient-to-tr from-primary/10 to-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="w-[310px] sm:w-[340px] bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xl hover:shadow-2xl transition-all duration-300 relative z-20 self-start transform -rotate-2 hover:rotate-0 hover:scale-105">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shadow-inner">
                    SK
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-slate-900 truncate">
                        Shahid Khan
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 font-bold rounded text-slate-500">
                        Mountains
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                      <span className="text-[10px] font-medium text-slate-500 truncate">
                        Hunza Valley, GB
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">10m ago</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Karakoram Highway near Attabad Lake is fully clear. Weather is
                  sunny but cold. Traffic is moving smoothly in both directions.
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                    <ThumbsUp className="w-3 h-3 text-primary fill-primary/10" />
                    <span className="text-[10px] font-bold text-slate-600">
                      24 Verify Votes
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Open & Safe
                  </span>
                </div>
              </div>

              <div className="w-[310px] sm:w-[340px] bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xl hover:shadow-2xl transition-all duration-300 relative z-30 self-end -mt-12 sm:-mt-16 transform rotate-3 hover:rotate-0 hover:scale-105">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shadow-inner">
                    AA
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-slate-900 truncate">
                        Ayesha Ahmed
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 font-bold rounded text-slate-500">
                        Cities
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                      <span className="text-[10px] font-medium text-slate-500 truncate">
                        Murree, Punjab
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">45m ago</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Heavy snow accumulation near Mall Road. Roads are extremely
                  slippery. Authorities are clearing the snow but expect
                  slow-moving traffic.
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                    <ThumbsUp className="w-3 h-3 text-primary fill-primary/10" />
                    <span className="text-[10px] font-bold text-slate-600">
                      42 Verify Votes
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-200 animate-pulse">
                    Closed / Blocked
                  </span>
                </div>
              </div>

              <div className="absolute -left-4 bottom-8 bg-white border border-slate-200/80 p-3 rounded-2xl shadow-lg flex items-center gap-2.5 z-40 animate-bounce-slow">
                <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-extrabold text-slate-900">
                    Active Warning
                  </p>
                  <p className="text-[9px] text-slate-500 font-semibold">
                    Low Visibility at Galyat
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="section-panel bg-slate-50 flex flex-col justify-center border-y border-slate-200/30 overflow-hidden"
      >
        {/* Background Image of Mountain Road */}
        <div className="absolute inset-0 z-0">
          <img
            src={mountainRoad}
            alt="Mountain Road"
            className="w-full h-full object-cover object-center opacity-50 select-none pointer-events-none"
          />
          {/* Transparent gradients to blend it perfectly */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-slate-50 z-0"></div>
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px] z-0"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mb-4">
              Real-Time Features Designed for Modern Travelers
            </h2>
            <p className="text-lg text-slate-700 font-medium">
              Whether you are driving to Skardu, trekking in Swat, or heading to
              Gwadar Beach, Waypulse keeps you informed step by step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-on-scroll">
            <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/80 hover:bg-white/95 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 mb-3">
                Crowd Ingestion
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Post live photos and status markers directly from the field.
                Updates are immediately distributed to all other users heading
                that way.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/80 hover:bg-white/95 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                <MapIcon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 mb-3">
                Live Interactive Maps
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Browse detailed hotspots with colour-coded statuses indicating
                road closures (red), warning advisories (orange), and safe
                passage (green).
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/80 hover:bg-white/95 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 mb-3">
                Upvote Verification
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Leverage community consensus. The upvote/downvote engine filters
                out noise and highlights authentic road condition changes
                instantly.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/80 hover:bg-white/95 hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 mb-3">
                Low-Bandwidth Sync
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Requires only 10–15 KB of data to upload a post. Even minimal
                edge signals will work in remote regions. Completely offline
                routing protocols are currently in development.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="feed"
        className="section-panel bg-slate-50 flex flex-col justify-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-center py-24">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 animate-on-scroll">
            <div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mb-3">
                Live Tourist & Route Updates Feed
              </h2>
              <p className="text-lg text-slate-600">
                Simulated real-time feeds from the active routes. Select a
                category or search.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, valley, or uploader..."
                aria-label="Search updates by city, valley, or uploader"
                className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-6 pb-2 border-b border-slate-200 animate-on-scroll">
            <span className="text-sm font-semibold text-slate-500 mr-2 flex items-center gap-1">
              <Filter className="w-4 h-4" /> Filter:
            </span>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/60"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto max-h-[50vh] pr-2 scrollbar-thin animate-on-scroll">
            {filteredUpdates.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 max-w-lg mx-auto">
                <Info className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="font-display font-extrabold text-xl text-slate-900 mb-2">
                  No updates found
                </h3>
                <p className="text-slate-600">
                  Try adjusting your search keywords or choosing a different
                  category filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredUpdates.map((update) => {
                  const isUpvoted = userVotes[update.id] === "up";
                  const isDownvoted = userVotes[update.id] === "down";

                  return (
                    <div
                      key={update.id}
                      className="flex flex-col bg-white rounded-3xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="p-5 flex items-center gap-3 border-b border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 shadow-inner">
                          {update.avatarInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900 truncate">
                              {update.userName}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 font-bold rounded-md text-slate-600">
                              {update.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <span className="text-xs font-medium truncate">
                              {update.location}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 align-self-start">
                          {update.timeAgo}
                        </span>
                      </div>

                      {update.imageUrl && (
                        <div className="h-48 overflow-hidden bg-slate-100 relative">
                          <img
                            src={update.imageUrl}
                            alt={update.location}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold shadow ${
                                update.status === "Opened"
                                  ? "bg-emerald-500 text-white"
                                  : "bg-red-500 text-white animate-pulse"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                              {update.status === "Opened"
                                ? "Open & Safe"
                                : "Road Closed"}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-5 flex-grow">
                        <p className="text-sm leading-relaxed text-slate-700">
                          {update.updateText}
                        </p>
                      </div>

                      <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-xl">
                          <button
                            onClick={() => handleVote(update.id, "up")}
                            aria-label="Upvote this update"
                            aria-pressed={isUpvoted}
                            className={`p-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                              isUpvoted
                                ? "bg-primary text-white shadow-sm"
                                : "hover:bg-slate-100 text-slate-500"
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">
                              {update.upvotes}
                            </span>
                          </button>
                          <button
                            onClick={() => handleVote(update.id, "down")}
                            aria-label="Downvote this update"
                            aria-pressed={isDownvoted}
                            className={`p-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                              isDownvoted
                                ? "bg-red-500 text-white shadow-sm"
                                : "hover:bg-slate-100 text-slate-500"
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">
                              {update.downvotes}
                            </span>
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            setActiveCommentsSection(
                              activeCommentsSection === update.id
                                ? null
                                : update.id,
                            )
                          }
                          aria-label="Toggle comments"
                          aria-expanded={activeCommentsSection === update.id}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{update.commentsCount} Comments</span>
                        </button>

                        <button
                          onClick={() =>
                            alert(
                              `Share link copied for ${update.location} update!`,
                            )
                          }
                          aria-label={`Share updates for ${update.location}`}
                          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {activeCommentsSection === update.id && (
                        <div className="bg-slate-50 p-5 border-t border-slate-100 animate-fade-in">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                            Comments
                          </h4>

                          {update.comments.length === 0 ? (
                            <p className="text-xs text-slate-500 italic mb-4">
                              No comments yet. Be the first to reply!
                            </p>
                          ) : (
                            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-1">
                              {update.comments.map((c) => (
                                <div
                                  key={c.id}
                                  className="text-xs bg-white p-2.5 rounded-xl border border-slate-200/50"
                                >
                                  <span className="font-bold text-slate-800 mr-1.5">
                                    {c.user}:
                                  </span>
                                  <span className="text-slate-600">
                                    {c.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={commentInputs[update.id] || ""}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({
                                  ...prev,
                                  [update.id]: e.target.value,
                                }))
                              }
                              placeholder="Ask or confirm status..."
                              className="flex-1 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <button
                              onClick={() => handleAddComment(update.id)}
                              className="bg-primary hover:bg-primary-hover text-white px-3.5 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                            >
                              <Send className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        id="map"
        className="section-panel bg-white flex flex-col justify-center border-y border-slate-200/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-center py-24">
          <div className="text-center max-w-3xl mx-auto mb-8 animate-on-scroll">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mb-4">
              Enterprise Tourism & Route Status Hub
            </h2>
            <p className="text-lg text-slate-600">
              Real-time geospatial tracking of tourism checkpoints across
              Pakistan. Verify weather, passability, and road status instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-on-scroll">
            <div className="lg:col-span-8 bg-slate-100 border border-slate-200 rounded-[2rem] p-2 relative flex items-center justify-center h-[45vh] lg:h-[55vh] overflow-hidden shadow-inner">
              <Suspense fallback={
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-3xl">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading Geospatial Map...</p>
                </div>
              }>
                <InteractiveMap
                  selectedHotspot={selectedHotspot}
                  setSelectedHotspot={setSelectedHotspot}
                  mapHotspots={MAP_HOTSPOTS}
                />
              </Suspense>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-between bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2rem] p-6 lg:p-8 h-[45vh] lg:h-[55vh] overflow-y-auto scrollbar-thin">
              <div>
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <MapPin className="w-6 h-6 text-slate-800" />
                    </div>
                    <h3 className="font-display font-extrabold text-2xl text-slate-900">
                      {selectedHotspot.name}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase shadow-sm tracking-wide ${
                      selectedHotspot.status === "Opened"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    {selectedHotspot.status === "Opened" ? "Clear" : "Blocked"}
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      Current Weather
                    </span>
                    <p className="text-base font-bold text-slate-900 mt-1">
                      {selectedHotspot.weather}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2 block">
                      Status Report & Warnings
                    </span>
                    <div
                      className={`flex items-start gap-3 p-4 rounded-2xl border ${selectedHotspot.status === "Opened" ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"}`}
                    >
                      {selectedHotspot.status === "Opened" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5 animate-pulse" />
                      )}
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {selectedHotspot.alert}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Updated {selectedHotspot.lastUpdated}
                </span>
                <button
                  onClick={() => {
                    setSearchQuery(selectedHotspot.name);
                    setSelectedCategory("All");
                    goToSection(2, -1);
                  }}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 hover:text-primary transition-colors group"
                >
                  View Reports{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="steps"
        className="section-panel bg-slate-50 flex flex-col justify-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-on-scroll">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mb-4">
              Keeping Travelers Safe in 3 Simple Steps
            </h2>
            <p className="text-lg text-slate-600">
              Waypulse works because of travelers like you. Keep yourself and
              others updated with just a few clicks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="text-center relative">
              <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center font-display font-black text-2xl mx-auto mb-6 shadow-lg shadow-primary/20">
                1
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 mb-3">
                Spot an Update
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                Encounter a landslide, heavy snowfall, a roadblock, or beautiful
                clear weather? Open the app and prepare your snapshot.
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-16 h-16 bg-indigo-500 text-white rounded-2xl flex items-center justify-center font-display font-black text-2xl mx-auto mb-6 shadow-lg shadow-indigo-500/20">
                2
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 mb-3">
                Publish to Map
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                Write a quick description, capture a photo, select the
                appropriate category tag, and drop it onto the location
                dashboard.
              </p>
            </div>

            <div className="text-center relative">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center font-display font-black text-2xl mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                3
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 mb-3">
                Help the Community
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                Other travelers view and verify your report via upvotes.
                Accurate data helps users redirect routes and stay safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="section-panel bg-white flex flex-col justify-between pt-24 pb-4"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full flex-1 overflow-y-auto max-h-[50vh] pr-2 scrollbar-thin animate-on-scroll">
          <div className="text-center mb-10">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Have questions? We have answers. If you need support, download the
              mobile app or get in touch.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFAQ === index;
              return (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-200/40 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFAQ(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-answer-${index}`}
                      className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-200/40 animate-fade-in"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 w-full mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                  W
                </div>
                <span className="font-display font-extrabold text-lg text-white">
                  Waypulse
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-500 text-center md:text-left">
                &copy; {new Date().getFullYear()} Waypulse. All rights reserved.
                Built with community love for Pakistan Tourism.
              </p>

              <div className="flex gap-6">
                <a
                  href="#"
                  className="hover:text-white transition-colors text-xs font-bold"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-xs font-bold"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="hover:text-white transition-colors text-xs font-bold"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </section>
      </main>

      {/* Floating Pagination Dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
        {[
          "Hero",
          "Features",
          "Live Feed",
          "Interactive Map",
          "Steps",
          "FAQs",
        ].map((label, idx) => {
          const isActive = activeSectionIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => {
                if (idx !== activeSectionIndex) {
                  const dir = idx > activeSectionIndex ? 1 : -1;
                  goToSection(idx, dir);
                }
              }}
              aria-label={`Scroll to ${label}`}
              aria-pressed={isActive}
              className="group relative flex items-center justify-end p-2 cursor-pointer focus:outline-none"
              title={label}
            >
              <span className="absolute right-8 px-2 py-1 rounded bg-slate-900/95 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none whitespace-nowrap shadow-md">
                {label}
              </span>
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                  isActive
                    ? "bg-primary border-primary scale-125 shadow-md shadow-primary/30"
                    : "bg-white/60 border-slate-400 hover:bg-slate-500 hover:border-slate-500"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
