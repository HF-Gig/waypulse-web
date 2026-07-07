import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Draggable);

export default function NavigationTabs({ activeTab, onTabClick }) {
  const tabs = [
    { id: "hero", label: "Home" },
    { id: "features", label: "Features" },
    { id: "feed", label: "Live Updates" },
    { id: "map", label: "Interactive Map" },
    { id: "faq", label: "FAQs" },
  ];

  const trackRef = useRef(null);
  const bubbleRef = useRef(null);
  const draggableInstanceRef = useRef(null);

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  const activeIndexRef = useRef(safeActiveIndex);
  useEffect(() => {
    activeIndexRef.current = safeActiveIndex;
  }, [safeActiveIndex]);

  // 1. Slide and stretch indicator when activeTab changes
  useGSAP(() => {
    if (!trackRef.current || !bubbleRef.current) return;
    const buttons = trackRef.current.querySelectorAll(".tab-btn");
    if (buttons.length === 0) return;

    const activeBtn = buttons[safeActiveIndex];
    const trackRect = trackRef.current.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const targetLeft = btnRect.left - trackRect.left;
    const targetWidth = btnRect.width;

    const currentLeft =
      parseFloat(gsap.getProperty(bubbleRef.current, "left")) || 4;
    const distance = targetLeft - currentLeft;

    if (Math.abs(distance) > 5) {
      // Liquid stretching effect based on travel distance
      const stretch = Math.min(Math.abs(distance) * 0.25, 35);
      const direction = distance > 0 ? 1 : -1;

      const tl = gsap.timeline();

      // Phase 1: Stretch out in the travel direction
      tl.to(bubbleRef.current, {
        width: targetWidth + stretch,
        left: direction > 0 ? currentLeft : targetLeft - stretch,
        duration: 0.22,
        ease: "power2.out",
      });

      // Phase 2: Snap back to target button width & position with an elastic spring
      tl.to(bubbleRef.current, {
        width: targetWidth,
        left: targetLeft,
        duration: 0.48,
        ease: "elastic.out(1, 0.75)",
      });
    } else {
      // Initial load or micro movements
      gsap.to(bubbleRef.current, {
        left: targetLeft,
        width: targetWidth,
        duration: 0.3,
        ease: "power1.out",
      });
    }
  }, [safeActiveIndex]);

  // 2. Setup Draggable drag-and-snap logic
  useGSAP(() => {
    if (!trackRef.current || !bubbleRef.current) return;

    const buttons = trackRef.current.querySelectorAll(".tab-btn");
    if (buttons.length === 0) return;

    const dragInstances = Draggable.create(bubbleRef.current, {
      type: "x",
      bounds: trackRef.current,
      trigger: trackRef.current,
      edgeResistance: 0.65,
      cursor: "grab",
      activeCursor: "grabbing",
      zIndexBoost: false,
      onDragStart: function () {
        gsap.killTweensOf(bubbleRef.current);
      },
      onDrag: function () {
        const velocity = this.pointerX - this.startX;
        const skewAmount = Math.max(Math.min(velocity * 0.04, 12), -12);
        gsap.set(bubbleRef.current, { skewX: skewAmount });
      },
      onDragEnd: function () {
        requestAnimationFrame(() => {
          if (!trackRef.current || !bubbleRef.current) return;

          const bubbleRect = bubbleRef.current.getBoundingClientRect();
          const trackRect = trackRef.current.getBoundingClientRect();
          const bubbleCenter =
            bubbleRect.left - trackRect.left + bubbleRect.width / 2;

          let closestIndex = 0;
          let minDistance = Infinity;

          buttons.forEach((btn, idx) => {
            const btnRect = btn.getBoundingClientRect();
            const btnCenter = btnRect.left - trackRect.left + btnRect.width / 2;
            const dist = Math.abs(bubbleCenter - btnCenter);
            if (dist < minDistance) {
              minDistance = dist;
              closestIndex = idx;
            }
          });

          // Set x offset back to 0, compensating via left offset to prevent positional jumping
          const currentDraggedLeft = bubbleRect.left - trackRect.left;
          gsap.set(bubbleRef.current, {
            x: 0,
            left: currentDraggedLeft,
            skewX: 0,
          });

          // Sync Draggable's internal position tracking with the manual left transition
          if (draggableInstanceRef.current) {
            draggableInstanceRef.current.update();
          }

          // Fire callback to trigger page navigation or snap back if index hasn't changed
          if (closestIndex !== activeIndexRef.current) {
            onTabClick(null, tabs[closestIndex].id);
          } else {
            const activeBtn = buttons[activeIndexRef.current];
            const btnRect = activeBtn.getBoundingClientRect();
            const targetLeft = btnRect.left - trackRect.left;
            gsap.to(bubbleRef.current, {
              left: targetLeft,
              width: btnRect.width,
              duration: 0.45,
              ease: "elastic.out(1, 0.75)",
            });
          }
        });
      },
      onClick: function (e) {
        // Click fallback logic inside the track
        const trackRect = trackRef.current.getBoundingClientRect();
        const clickLeft = e.clientX - trackRect.left;

        let clickedIndex = 0;
        let minDistance = Infinity;

        buttons.forEach((btn, idx) => {
          const btnRect = btn.getBoundingClientRect();
          const btnCenter = btnRect.left - trackRect.left + btnRect.width / 2;
          const dist = Math.abs(clickLeft - btnCenter);
          if (dist < minDistance) {
            minDistance = dist;
            clickedIndex = idx;
          }
        });

        onTabClick(e, tabs[clickedIndex].id);
      },
    });

    draggableInstanceRef.current = dragInstances[0];

    return () => {
      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.kill();
      }
    };
  }, []);

  // 3. Keep layout in sync on window resizing
  useEffect(() => {
    const handleResize = () => {
      if (!trackRef.current || !bubbleRef.current) return;
      const buttons = trackRef.current.querySelectorAll(".tab-btn");
      if (buttons.length === 0) return;
      const activeBtn = buttons[safeActiveIndex];
      const trackRect = trackRef.current.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      gsap.set(bubbleRef.current, {
        left: btnRect.left - trackRect.left,
        width: btnRect.width,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [safeActiveIndex]);

  return (
    <div
      ref={trackRef}
      className="relative flex items-center p-1 rounded-full liquid-glass-track select-none cursor-pointer"
      style={{ touchAction: "none" }}
    >
      {/* Sliding Transparent Liquid Bubble */}
      <div
        ref={bubbleRef}
        className="absolute h-[calc(100%-8px)] rounded-full liquid-glass-bubble z-0"
        style={{ left: 4 }}
      />

      {/* Text Labels (Rendered above bubble, event captures delegated to track) */}
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <div
            key={tab.id}
            className={`tab-btn relative z-10 px-5 py-2 text-sm font-semibold rounded-full transition-colors duration-300 pointer-events-none ${
              isActive
                ? "text-primary font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </div>
        );
      })}
    </div>
  );
}
