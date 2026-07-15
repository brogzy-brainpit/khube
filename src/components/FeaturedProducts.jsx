import React from "react";
import ScrambleText from "@/effects/ScrambleText";
import ScrambleTextPara from "@/effects/ScrambleTextPara";
import GridColumn from "@/layout/GridColumn";
import Section from "@/layout/Section";
import Swiper from "./Swiper";

function FeaturedProducts({ collection }) {
  if (!collection) return null;

  return (
    <div className="py-12">
      <Section>
        <GridColumn className="gap-[0em] lg:gap-[1.5em]">
          {/* Heading */}
          <div className="col-span-full md:col-span-6 lg:col-span-12">
            <h2 className="text-heading2 text-left uppercase text-brand-black font-custom">
              <ScrambleText
                hoverEffect={false}
                once={false}
                text={collection.title}
                lettrs="▚ ▜ ▞ ▛ ▟ ▘▅ ▖▙ ▞ ▚ ▆ ▜ "
                letter="♫ ♟ ♚ ♠ ♬ ♛ ♪ ♜ ♠ ♫ ♝ ♪ ♞ ♫ ♟ ♠ ♞ ♛ ♠ ♡ ♚ ♣ ♤ ♥ ♦ ♫ ♬ ♪ ♩"
                l="☯ ☠ ☢ ☣"
                className="text-neutral-800 tracking-tighter font-custom"
              />
            </h2>
          </div>

          {/* Description */}
          <div className="col-span-5 mt-[6em] mb-[4em] col-start-2 lg:col-start-8 lg:my-10 md:col-span-6 lg:col-span-5">
            <p className="text-para leading-[1.2] w-full text-left text-brand-black font-custom">
              <ScrambleTextPara
                duration={1.4}
                text={collection.description}
                letter="▚ ▜ ▞ ▃ ▛ ▟ ▘▅ ▖▙ ▄ ▞ ▚ ▆ ▜"
                className="text-neutral-800 tracking-tighter font-custom"
              />
            </p>
          </div>

          {/* Products */}
          <div className="col-span-full">
            <Swiper products={collection.products.nodes} />
          </div>
        </GridColumn>
      </Section>
    </div>
  );
}

export default FeaturedProducts;