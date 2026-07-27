"use client";

import { useState } from "react";
import { Checkbox } from "../ui/checkbox";

export function FilterSidebar() {

  const [men, setMen] = useState(false);
  const [women, setWomen] = useState(false);

  const [shirts, setShirts] = useState(false);
  const [pants, setPants] = useState(false);
  const [jackets, setJackets] = useState(false);

  return (
    <aside className="space-y-10">

      <div>

        <h3 className="mb-4 text-lg font-semibold">
          Gender
        </h3>

        <div className="space-y-3">

          <Checkbox
            label="Men"
            checked={men}
            onChange={() => setMen(!men)}
          />

          <Checkbox
            label="Women"
            checked={women}
            onChange={() => setWomen(!women)}
          />

        </div>

      </div>

      <div>

        <h3 className="mb-4 text-lg font-semibold">
          Category
        </h3>

        <div className="space-y-3">

          <Checkbox
            label="Shirts"
            checked={shirts}
            onChange={() => setShirts(!shirts)}
          />

          <Checkbox
            label="Pants"
            checked={pants}
            onChange={() => setPants(!pants)}
          />

          <Checkbox
            label="Jackets"
            checked={jackets}
            onChange={() => setJackets(!jackets)}
          />

        </div>

      </div>


      <div>

  <h3 className="mb-4 text-lg font-semibold">
    Price
  </h3>

  <input
    type="range"
    min={0}
    max={30000}
    className="w-full"
  />

  <div className="mt-2 flex justify-between text-sm text-neutral-500">

    <span>0 DA</span>

    <span>30 000 DA</span>

  </div>

</div>
    </aside>
  );
}