import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Marquee = () => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);

  useGSAP(
    () => {
      const marqueeItems = gsap.utils.toArray(".marquee h1");
      if (marqueeItems.length === 0) return;

      // Helper function for horizontal loop
      function horizontalLoop(items, config) {
        items = gsap.utils.toArray(items);
        config = config || {};
        let tl = gsap.timeline({
          repeat: config.repeat,
          defaults: { ease: "none" },
          paused: config.paused,
        });
        let length = items.length;
        let startX = items[0].offsetLeft;
        let times = [],
          widths = [],
          xPercents = [],
          curIndex = 0;
        let pixelsPerSecond = (config.speed || 1) * 100;
        let snap =
          config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1); // some makers snap to whole pixels to allow better browser optimizations.
        let totalWidth;

        gsap.set(items, {
          xPercent: (i, el) => {
            let w = (widths[i] = parseFloat(
              gsap.getProperty(el, "width", "px"),
            ));
            xPercents[i] = snap(
              (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
                gsap.getProperty(el, "xPercent"),
            );
            return xPercents[i];
          },
        });
        gsap.set(items, { x: 0 });
        totalWidth =
          items[length - 1].offsetLeft +
          (xPercents[length - 1] / 100) * widths[length - 1] -
          startX +
          items[length - 1].offsetWidth *
            gsap.getProperty(items[length - 1], "scaleX") +
          (parseFloat(config.paddingRight) || 0);

        for (let i = 0; i < length; i++) {
          let item = items[i];
          let curX = (xPercents[i] / 100) * widths[i];
          let distanceToStart = item.offsetLeft + curX - startX;
          let distanceToLoop =
            distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");

          tl.to(
            item,
            {
              xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
              duration: distanceToLoop / pixelsPerSecond,
            },
            0,
          )
            .fromTo(
              item,
              {
                xPercent: snap(
                  ((curX - distanceToLoop + totalWidth) / widths[i]) * 100,
                ),
              },
              {
                xPercent: xPercents[i],
                duration:
                  (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
                immediateRender: false,
              },
              distanceToLoop / pixelsPerSecond,
            )
            .add("label" + i, distanceToStart / pixelsPerSecond);
          times[i] = distanceToStart / pixelsPerSecond;
        }
        return tl;
      }

      const marqueeTimeline = horizontalLoop(marqueeItems, {
        repeat: -1,
        paddingRight: 30,
        speed: 1,
      });

      timelineRef.current = marqueeTimeline;
      marqueeTimeline.timeScale(-1); // Initial direction

      // Scroll direction logic
      let lastScrollY = window.scrollY;
      let scrollDirection = -1;
      let ticking = false;

      const updateMarqueeDirection = () => {
        const currentScrollY = window.scrollY;
        const newDirection = currentScrollY > lastScrollY ? 1 : -1;

        if (newDirection !== scrollDirection) {
          scrollDirection = newDirection;
          gsap.to(marqueeTimeline, {
            timeScale: scrollDirection,
            duration: 0.3,
            ease: "power2.out",
          });
        }
        lastScrollY = currentScrollY;
        ticking = false;
      };

      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(updateMarqueeDirection);
          ticking = true;
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", onScroll);
        marqueeTimeline.kill();
      };
    },
    { scope: containerRef },
  );

  return (
    <div className="card-marquee" ref={containerRef}>
      <div className="marquee">
        <h1>Design Beyond Boundaries </h1>
        <h1>Built for Tomorrow</h1>
      </div>
    </div>
  );
};

export default Marquee;
