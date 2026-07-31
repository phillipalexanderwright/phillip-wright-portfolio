(() => {
  const portfolioPath = (key) => `project.html?project=${key}`;

  window.PROJECTS = {
    alta: {
      number: "01",
      title: "Alta Gardens",
      category: "Skilled Nursing Operations",
      group: "Care Infrastructure",
      summary:
        "Leading a 160-person skilled nursing operation through rapid growth, full occupancy, and a more disciplined operating model.",
      role:
        "I serve as Administrator, leading clinical, administrative, and support teams across census, payer mix, staffing, compliance, referral growth, and specialty service lines.",
      impact:
        "Monthly revenue grew from $1.2M to $2.5M, occupancy rose from 85% to 100%, and overtime and double-time fell from 15% to 3%.",
      designLine:
        "A care identity grounded in trust, clarity, and the rigor required to run a high-performing clinical operation.",
      tags: ["Healthcare", "Operations", "Turnaround"],
      metrics: [
        { value: "$2.5M", label: "Monthly revenue" },
        { value: "100%", label: "Occupancy" },
        { value: "3%", label: "OT / double-time" },
      ],
      accent: "#687451",
      logo: "assets/alta-gardens-logo.svg",
      links: {
        portfolio: portfolioPath("alta"),
        website: "",
        instagram: "",
      },
    },
    dawn: {
      number: "02",
      title: "Dawn",
      category: "Residential Care Platform",
      group: "Care Infrastructure",
      summary:
        "Building specialized residential care infrastructure for people with higher-acuity developmental and behavioral needs.",
      role:
        "I help lead business strategy, licensing, operations, growth, program development, administrator support, compliance planning, and expansion.",
      impact:
        "It is the kind of care infrastructure I want to build: specialized, human-centered, and able to serve people who often fall through the cracks.",
      designLine:
        "A residential care platform designed to make specialized support feel human, calm, and dependable.",
      tags: ["Healthcare", "Operations", "Licensing"],
      metrics: [],
      accent: "#954130",
      logo: "assets/dawn-logo.svg",
      links: {
        portfolio: portfolioPath("dawn"),
        website: "https://dawn.care",
        instagram: "",
      },
    },
    anara: {
      number: "03",
      title: "Anara",
      category: "Hospice Operations",
      group: "Care Infrastructure",
      summary:
        "Bringing clinical oversight, thoughtful operations, and patient dignity together at one of healthcare's most personal moments.",
      role:
        "I am a founder/operator involved in strategy, partnerships, compliance, growth, medical leadership alignment, and operational problem-solving.",
      impact:
        "Done well, hospice gives patients and families peace, clarity, and support during one of life's hardest stages.",
      designLine:
        "A hospice identity shaped around dignity, composure, and the confidence families need at a difficult moment.",
      tags: ["Hospice", "Partnerships", "Compliance"],
      metrics: [],
      accent: "#687451",
      logo: "assets/anara-logo.svg",
      links: {
        portfolio: portfolioPath("anara"),
        website: "https://anara.care",
        instagram: "https://www.instagram.com/anarahospice/",
      },
    },
    aevra: {
      number: "04",
      title: "Aevra",
      category: "Patient Mobility",
      group: "Care Infrastructure",
      summary:
        "Building safer, more reliable non-emergency medical transportation around the needs and dignity of each patient.",
      role:
        "I lead the company vision, brand, business model, partnerships, launch strategy, and operational structure.",
      impact:
        "It addresses missed appointments, delayed discharges, unreliable transport, and patients being treated like logistics problems.",
      designLine:
        "A patient-mobility brand balancing speed and reliability with a more elevated, human service experience.",
      tags: ["Healthcare", "Transportation", "Operations"],
      metrics: [],
      accent: "#3b0014",
      logo: "assets/aevra-logo.svg",
      links: {
        portfolio: portfolioPath("aevra"),
        website: "https://aevra.care/",
        instagram: "https://www.instagram.com/rideaevra/",
      },
    },
    balboa: {
      number: "05",
      title: "Balboa",
      wordmark: "Balboa Nursing + Rehabilitation",
      category: "Skilled Nursing + Rehabilitation",
      group: "Care Infrastructure",
      summary:
        "A 370-person, high-acuity skilled nursing operation led through census growth, workforce stabilization, regulatory performance, and financial improvement.",
      role:
        "I served as Administrator across clinical, administrative, and support teams, aligning staffing, referrals, quality, compliance, and operating performance.",
      impact:
        "Monthly revenue grew from $2M to $3.5M, occupancy rose from 85% to 100%, overtime fell from 15% to 6%, and the facility maintained five stars overall.",
      designLine:
        "An operator case study in aligning people, quality, compliance, and financial performance at meaningful scale.",
      tags: ["Healthcare", "Leadership", "Turnaround"],
      metrics: [
        { value: "$3.5M", label: "Monthly revenue" },
        { value: "100%", label: "Occupancy" },
        { value: "6%", label: "Overtime" },
        { value: "5 stars", label: "Overall rating" },
      ],
      accent: "#687451",
      logo: "",
      links: {
        portfolio: portfolioPath("balboa"),
        website: "",
        instagram: "",
      },
    },
    footplay: {
      number: "06",
      title: "Footplay",
      category: "Music and Events",
      group: "Creative Systems",
      summary:
        "A music and event collective centered around house, disco, open-air shows, underground nightlife, and intentional community.",
      role:
        "I am the founder, curator, and creative lead across the brand, events, music direction, and overall experience.",
      impact:
        "It gives me a way to build culture outside healthcare through music, design, community, and shared experiences.",
      designLine:
        "A flexible visual and experiential identity built for dance floors, open air, and a community with its own point of view.",
      tags: ["Music", "Events", "Creative Direction"],
      metrics: [],
      accent: "#00291c",
      logo: "assets/footplay-logo.svg",
      links: {
        portfolio: portfolioPath("footplay"),
        website: "",
        instagram: "https://www.instagram.com/footplaycollective/?hl=en",
      },
    },
    strasbourg: {
      number: "07",
      title: "Strasbourg",
      category: "Artist Identity",
      group: "Creative Systems",
      summary:
        "My artist identity for DJing and production, rooted in atmospheric disco, jackin house, minimal, and nu-disco.",
      role:
        "I create and perform under this alias as a distinct creative lane from my healthcare and business ventures.",
      impact:
        "It gives me a long-term space to explore taste, sound, emotion, and identity.",
      designLine:
        "An artist system that turns atmosphere, rhythm, and restraint into a recognizable visual and sonic world.",
      tags: ["Music", "Identity", "Performance"],
      metrics: [],
      accent: "#687451",
      logo: "assets/strasbourg-logo.svg",
      links: {
        portfolio: portfolioPath("strasbourg"),
        website: "",
        instagram: "https://www.instagram.com/strasbourg.fever/?hl=en",
      },
    },
    badsoup: {
      number: "08",
      title: "Badsoup",
      category: "Creative Collective",
      group: "Creative Systems",
      summary:
        "A collective at the intersection of skate culture, punk, local art, shows, merchandise, magazines, and collaboration.",
      role:
        "I helped shape the vision, creative direction, events, collaborations, and cultural energy behind the collective.",
      impact:
        "It created an independent space for artists, skaters, musicians, and outsiders to build together.",
      designLine:
        "A raw, adaptable identity made to move between printed matter, merchandise, events, and local subculture.",
      tags: ["Culture", "Editorial", "Community"],
      metrics: [],
      accent: "#954130",
      logo: "assets/badsoup-logo.svg",
      links: {
        portfolio: portfolioPath("badsoup"),
        website: "",
        instagram: "https://www.instagram.com/badsoup/?hl=en",
      },
    },
    brainstorm: {
      number: "09",
      title: "Brainstorm",
      category: "Event Production",
      group: "Creative Systems",
      summary:
        "My first production outlet, built to bring intentional house-music experiences to Provo, Utah.",
      role:
        "I helped develop the concept, partnerships, talent booking, production investment, and event direction.",
      impact:
        "It was my first proof that I could build culture from the ground up in a market that was not built for it yet.",
      designLine:
        "A production identity built around sound, installation, atmosphere, and a no-phone dance floor.",
      tags: ["Events", "Production", "Community"],
      metrics: [],
      accent: "#3b0014",
      logo: "assets/brainstorm-logo.png",
      links: {
        portfolio: portfolioPath("brainstorm"),
        website: "",
        instagram: "https://www.instagram.com/operationbrainstorm/?hl=en",
      },
    },
  };

  window.PROJECT_ORDER = [
    "alta",
    "dawn",
    "anara",
    "aevra",
    "balboa",
    "footplay",
    "strasbourg",
    "badsoup",
    "brainstorm",
  ];
})();
