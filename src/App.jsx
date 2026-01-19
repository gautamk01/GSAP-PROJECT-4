import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import IntroCard from "./components/IntroCard";
import ProjectCard from "./components/ProjectCard";

gsap.registerPlugin(ScrollTrigger, SplitText);

function App() {
  const projects = [
    { title: "Curved Horizon Two", img: "/img/img1.jpeg" },
    { title: "Magic is Here", img: "/img/img4.jpg" },
    { title: "Welcome to GK World", img: "/img/img3.jpg" },
  ];

  useGSAP(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Get all cards
    const cards = gsap.utils.toArray(".card");
    const introCard = cards[0];

    // Split and wrap all titles
    const titles = gsap.utils.toArray(".card-title h1");
    titles.forEach((title) => {
      const split = new SplitText(title, {
        type: "chars",
        charsClass: "char",
      });
      split.chars.forEach((char) => {
        char.innerHTML = `<span>${char.textContent}</span>`;
        gsap.set(char.querySelector("span"), { x: "100%" });
      });
    });

    // Setup intro card initial states
    const cardImgWrapper = introCard.querySelector(".card-img");
    const cardImg = introCard.querySelector(".card-img img");
    gsap.set(cardImgWrapper, { scale: 0.5, borderRadius: "400px" });
    gsap.set(cardImg, { scale: 1.5 });

    // Animation helper functions
    function animateContentIn(titleChars, description) {
      gsap.to(titleChars, {
        x: "0%",
        duration: 0.75,
        ease: "power4.out",
        stagger: 0.02,
      });
      gsap.to(description, {
        x: 0,
        opacity: 1,
        duration: 0.75,
        delay: 0.1,
        ease: "power4.out",
      });
    }

    function animateContentOut(titleChars, description) {
      gsap.to(titleChars, {
        x: "100%",
        duration: 0.55,
        ease: "power4.out",
        stagger: 0.01,
      });
      gsap.to(description, {
        x: "40px",
        opacity: 0,
        duration: 0.5,
        delay: 0.1,
        ease: "power4.out",
      });
    }

    // Intro card content elements
    const marquee = introCard.querySelector(".card-marquee .marquee");
    const titleChars = introCard.querySelectorAll(".char span");
    const description = introCard.querySelector(".card-description");
    gsap.set(description, { x: "40px", opacity: 0 });

    // Intro card scroll animation
    introCard.contentRevealed = false;
    ScrollTrigger.create({
      trigger: introCard,
      start: "top top",
      end: "+=300vh",
      pin: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const imageScale = 0.5 + progress * 0.5;
        const borderRadius = 400 - progress * 375;
        const innerImgScale = 1.5 - progress * 0.5;

        gsap.set(cardImgWrapper, {
          scale: imageScale,
          borderRadius: borderRadius + "px",
        });
        gsap.set(cardImg, { scale: innerImgScale });

        // Marquee fade
        if (marquee) {
          if (imageScale >= 0.5 && imageScale <= 0.75) {
            const fadeProgress = (imageScale - 0.5) / (0.75 - 0.5);
            gsap.set(marquee, { opacity: 1 - fadeProgress });
          } else if (imageScale < 0.5) {
            gsap.set(marquee, { opacity: 1 });
          } else if (imageScale > 0.75) {
            gsap.set(marquee, { opacity: 0 });
          }
        }

        // Content reveal
        if (progress >= 1 && !introCard.contentRevealed) {
          introCard.contentRevealed = true;
          animateContentIn(titleChars, description);
        }
        if (progress < 1 && introCard.contentRevealed) {
          introCard.contentRevealed = false;
          animateContentOut(titleChars, description);
        }
      },
    });

    // Other cards pinning
    cards.forEach((card, index) => {
      if (index === 0) return;
      const isLastCard = index === cards.length - 1;

      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        end: isLastCard ? "+=100vh" : "bottom top",
        pin: true,
        pinSpacing: isLastCard,
      });
    });

    // Card wrapper scaling (entrance effect)
    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        const cardWrapper = card.querySelector(".card-wrapper");
        if (cardWrapper) {
          ScrollTrigger.create({
            trigger: cards[index + 1],
            start: "top bottom",
            end: "top top",
            onUpdate: (self) => {
              const progress = self.progress;
              gsap.set(cardWrapper, {
                scale: 1 - progress * 0.25,
                opacity: 1 - progress,
              });
            },
          });
        }
      }
    });

    // Card image scaling (zoom effect)
    cards.forEach((card, index) => {
      if (index > 0) {
        const cardImg = card.querySelector(".card-img img");
        const imgContainer = card.querySelector(".card-img");

        if (cardImg && imgContainer) {
          gsap.set(cardImg, { scale: 2 });
          gsap.set(imgContainer, { borderRadius: "150px" });

          ScrollTrigger.create({
            trigger: card,
            start: "top bottom",
            end: "top top",
            onUpdate: (self) => {
              const progress = self.progress;
              gsap.set(cardImg, { scale: 2 - progress });
              gsap.set(imgContainer, {
                borderRadius: 150 - progress * 125 + "px",
              });
            },
          });
        }
      }
    });

    // Content animation for other cards
    cards.forEach((card, index) => {
      if (index === 0) return;

      const cardDescription = card.querySelector(".card-description");
      const cardTitleChars = card.querySelectorAll(".char span");

      if (cardDescription && cardTitleChars.length > 0) {
        gsap.set(cardDescription, { x: "40px", opacity: 0 });

        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          onEnter: () => animateContentIn(cardTitleChars, cardDescription),
          onLeaveBack: () => animateContentOut(cardTitleChars, cardDescription),
        });
      }
    });
  });

  return (
    <>
      <section className="intro">
        <h1>We design space that don't just exist</h1>
      </section>

      <section className="cards">
        <IntroCard title="Curved Horizon" img="/img/cap3-square.jpg" />

        {projects.map((proj, index) => (
          <ProjectCard
            key={index}
            title={proj.title}
            img={proj.img}
            isLast={index === projects.length - 1}
          />
        ))}
      </section>

      <section className="outro">
        <h1>Architecture reimagined for the virtual age</h1>
      </section>
    </>
  );
}

export default App;
