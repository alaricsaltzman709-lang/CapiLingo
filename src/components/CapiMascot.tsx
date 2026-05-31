import React from "react";
import { motion } from "motion/react";

interface CapiProps {
  mood?: "neutral" | "happy" | "thinking" | "sad" | "celebrating";
  className?: string;
  size?: number;
  bubbleText?: string;
}

export default function CapiMascot({
  mood = "neutral",
  className = "",
  size = 140,
  bubbleText,
}: CapiProps) {
  // Animating the ears and snout subtle movements based on mood
  const headVariants = {
    neutral: { y: [0, -3, 0], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } },
    happy: { y: [0, -6, 0], scale: [1, 1.03, 1], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } },
    thinking: { rotate: [0, 4, -4, 0], transition: { repeat: Infinity, duration: 4, ease: "easeInOut" } },
    sad: { y: [0, 2, 0], rotate: [0, -2, 2, 0], transition: { duration: 2, ease: "easeInOut" } },
    celebrating: { y: [0, -15, 0], scale: [1, 1.08, 1], transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" } },
  };

  const earVariants = {
    active: { rotate: [0, 8, -5, 0], transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } },
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Speech bubble for Capi */}
      {bubbleText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative mb-3 max-w-[240px] rounded-2xl bg-emerald-50 dark:bg-emerald-950 p-3 text-xs md:text-sm text-emerald-800 dark:text-emerald-200 shadow-md border border-emerald-200 dark:border-emerald-800"
        >
          <p className="font-medium text-center leading-relaxed">{bubbleText}</p>
          {/* Arrow */}
          <div className="absolute left-1/2 -bottom-2 h-4 w-4 -translate-x-1/2 rotate-45 border-r border-b border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950" />
        </motion.div>
      )}

      {/* Capybara SVG Container */}
      <motion.div
        animate={mood}
        variants={headVariants}
        style={{ width: size, height: size }}
        className="relative cursor-pointer select-none"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* BACKGROUND STEAM OR WATER IN CELEBRATING/COZY BATH MOOD */}
          {(mood === "happy" || mood === "celebrating") && (
            <>
              {/* Bath tub outline if playing or bathing */}
              <circle cx="100" cy="180" r="40" fill="#93c5fd" opacity="0.3" />
              <motion.path
                d="M 60 150 Q 80 135 100 150 T 140 150"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </>
          )}

          {/* MAIN FOOTPRINT / SHADOW */}
          <ellipse cx="100" cy="180" rx="60" ry="12" fill="#000000" opacity="0.12" />

          {/* CAPYBARA BODY */}
          <rect
            x="45"
            y="75"
            width="110"
            height="100"
            rx="50"
            fill="#a16207" // Golden brown body
            className="transition-colors duration-300"
          />

          {/* BELLY SPLASH OF LIGHT BREAST COLOR */}
          <ellipse cx="100" cy="135" rx="40" ry="40" fill="#ca8a04" opacity="0.35" />

          {/* CAPYBARA HEAD (Drawn protruding forward, classic chubby block muzzle) */}
          <rect
            x="70"
            y="35"
            width="90"
            height="70"
            rx="28"
            fill="#854d0e" // Darker brown head
          />

          {/* MUZZLE & SNOUT - CLASSIC CAPYBARA FLAT FRONT */}
          <path
            d="M 115 50 L 155 52 L 158 85 L 120 90 Z"
            fill="#713f12"
            cx="140"
            cy="70"
          />
          {/* NOSTRIL */}
          <ellipse cx="151" cy="62" rx="3" ry="2" fill="#451a03" />

          {/* EARS - WIGGLY */}
          <motion.path
            d="M 78 36 C 70 20, 94 20, 88 36 Z"
            fill="#854d0e"
            stroke="#713f12"
            strokeWidth="2"
            variants={earVariants}
            animate="active"
          />
          <path d="M 81 32 C 77 24, 87 24, 85 32 Z" fill="#ca8a04" opacity="0.4" />

          {/* EYES based on MOOD */}
          {mood === "neutral" && (
            <>
              {/* Quiet sleepy content eye */}
              <ellipse cx="120" cy="54" rx="4.5" ry="4.5" fill="#1e1b4b" />
              <ellipse cx="121" cy="52" rx="1.5" ry="1.5" fill="#ffffff" />
            </>
          )}

          {mood === "happy" && (
            <>
              {/* Happy curves */}
              <path
                d="M 116 56 Q 121 48 126 56"
                fill="none"
                stroke="#1e293b"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 140 58 Q 143 51 146 58"
                fill="none"
                stroke="#1e293b"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />
            </>
          )}

          {mood === "thinking" && (
            <>
              {/* Inquisitive large eye with reading glasses */}
              <ellipse cx="121" cy="54" rx="5" ry="5" fill="#451a03" />
              <path
                d="M 110 52 L 132 52 M 110 54 Q 121 68 132 54"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3.5"
              />
              {/* Small spectacles line */}
              <line x1="100" y1="52" x2="110" y2="52" stroke="#f59e0b" strokeWidth="2" />
            </>
          )}

          {mood === "sad" && (
            <>
              {/* Sad downward slopes */}
              <path
                d="M 116 54 Q 121 62 126 54"
                fill="none"
                stroke="#1e1b4b"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Small teardrop line */}
              <path d="M 125 58 Q 122 72 120 74 Z" fill="#38bdf8" />
            </>
          )}

          {mood === "celebrating" && (
            <>
              {/* Sparkling eyes */}
              <path
                d="M 114 54 L 126 54 M 120 48 L 120 60"
                stroke="#eab308"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <ellipse cx="140" cy="55" rx="5" ry="5" fill="#ca8a04" opacity="0.3" />
            </>
          )}

          {/* SMILE - FRIENDLY SNOUT SPLIT */}
          {mood !== "sad" ? (
            <path
              d="M 142 78 Q 148 83 154 78"
              fill="none"
              stroke="#451a03"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M 142 82 Q 148 76 154 82"
              fill="none"
              stroke="#451a03"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* ROSY CHEEKS */}
          {mood === "happy" || mood === "celebrating" ? (
            <circle cx="112" cy="65" r="7" fill="#ef4444" opacity="0.4" />
          ) : null}

          {/* GRADUATION CAP FOR INTELLECTUAL VIBE (thinking / celebrating) */}
          {(mood === "thinking" || mood === "celebrating") && (
            <motion.g
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              className="origin-center"
            >
              {/* Mortar board flat top */}
              <polygon points="65,22 115,10 125,22 75,34" fill="#1e1b4b" stroke="#475569" strokeWidth="1" />
              {/* Cap base fitted on head */}
              <path d="M 80 27 L 108 21 L 110 32 L 85 35 Z" fill="#312e81" />
              {/* Yellow tassel dangling */}
              <path d="M 90 16 L 68 28 L 68 34" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <circle cx="68" cy="34" r="2.5" fill="#f59e0b" />
            </motion.g>
          )}

          {/* SWEET SWEET LEAF IN SNOUT (neutral / happy) */}
          {mood === "neutral" && (
            <g transform="translate(144, 76) rotate(-15)">
              <rect x="0" y="0" width="14" height="3" rx="1.5" fill="#22c55e" />
              <ellipse cx="14" cy="0" rx="6" ry="4" fill="#4ade80" />
            </g>
          )}

          {/* ORANGE FLOATING BACKPACK OR CITRUS HAIR-TOWEL IF SAUNA COZY */}
          {mood === "happy" && (
            <g transform="translate(95, 20)">
              {/* Little cute orange on head like the traditional Japanese capybara baths! */}
              <circle cx="10" cy="11" r="10" fill="#f97316" />
              <circle cx="10" cy="11" r="8" fill="#fb923c" />
              {/* Green leaf on top */}
              <path d="M 10 1 Q 14 -3 14 -6 Q 10 -4 10 1" fill="#22c55e" />
            </g>
          )}
        </svg>

        {/* LITTLE CELEBRATION STARS/EMOJIS FOR CELEBRATING */}
        {mood === "celebrating" && (
          <>
            <motion.span
              animate={{ y: [-10, -35], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.1 }}
              className="absolute -top-4 -left-2 text-xl"
            >
              ✨
            </motion.span>
            <motion.span
              animate={{ y: [-5, -28], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: 0.5 }}
              className="absolute -top-6 right-0 text-xl"
            >
              ⭐
            </motion.span>
            <motion.span
              animate={{ scale: [0.5, 1.2, 0.5], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
              className="absolute top-10 -right-6 text-xl"
            >
              🎓
            </motion.span>
          </>
        )}
      </motion.div>
    </div>
  );
}
