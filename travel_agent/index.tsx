import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useConversation } from '@elevenlabs/react';
import {
  MapPin,
  History,
  Info,
  MessageSquare,
  Mic,
  Send,
  X,
  ChevronRight,
  Menu,
  Sun,
  Moon,
  Coffee,
  Camera,
  Globe,
  Headphones,
  ArrowRight,
  Plane,
  Hotel,
  ExternalLink,
  MicOff,
  MessageCircle,
  Bot,
  Volume2,
  VolumeX
} from 'lucide-react';


// --- Constants & Data ---

const COLORS = {
  majorelle: "#0044CC", // Majorelle Blue
  terracotta: "#C0392B", // Red Earth
  sand: "#F5E6CA", // Desert Sand
  gold: "#D4AF37", // Islamic Gold
  emerald: "#2ECC71", // Tile Green
  dark: "#2C3E50",
};

const CITIES = [
  {
    name: "Marrakech",
    title: "The Red City",
    image:
      "https://images.unsplash.com/photo-1570135460237-510ca82c6781?q=80&w=800&auto=format&fit=crop",
    desc: "A sensory overload of colors, smells, and sounds. Explore the bustling souks of the Medina.",
    details:
      "Marrakech is a former imperial city in western Morocco, and a major economic center and home to mosques, palaces and gardens. The medina is a densely packed, walled medieval city dating to the Berber Empire, with mazelike alleys where thriving souks (marketplaces) sell traditional textiles, pottery and jewelry.",
    highlights: [
      "Jemaa el-Fnaa",
      "Majorelle Garden",
      "Bahia Palace",
      "Koutoubia Mosque",
    ],
  },
  {
    name: "Chefchaouen",
    title: "The Blue Pearl",
    image:
      "https://images.unsplash.com/photo-1664180347615-13cab19485dc?q=80&w=800&auto=format&fit=crop",
    desc: "Nestled in the Rif Mountains, famous for its striking blue-washed buildings.",
    details:
      "Chefchaouen, or Chaouen, is a city in the Rif Mountains of northwest Morocco. It’s known for the striking, blue-washed buildings of its old town. Leather and weaving workshops line its steep cobbled lanes. In the shady main square of Place Outa el Hammam is the red-walled Kasbah, a 15th-century fortress and dungeon.",
    highlights: [
      "Old City (Medina)",
      "Spanish Mosque",
      "Kasbah Museum",
      "Ras El Maa Waterfall",
    ],
  },
  {
    name: "Fes",
    title: "The Spiritual Capital",
    image:
      "https://images.unsplash.com/photo-1730759214696-0aba472f83a6?q=80&w=800&auto=format&fit=crop",
    desc: "Home to the world's oldest university and a labyrinth of over 9,000 alleys.",
    details:
      "Fes is a northeastern Moroccan city often referred to as the country’s cultural capital. It’s primarily known for its Fes El Bali walled medina, with medieval Marinid architecture, vibrant souks and old-world atmosphere. The medina is home to religious schools such as the 14th-century Bou Inania and Al Attarine.",
    highlights: [
      "Al Quaraouiyine University",
      "Chouara Tannery",
      "Bou Inania Madrasa",
      "Blue Gate",
    ],
  },
  {
    name: "Merzouga",
    title: "Gateway to Sahara",
    image:
      "https://images.unsplash.com/photo-1685625790395-c9d776211ba6?q=80&w=800&auto=format&fit=crop",
    desc: "Experience the magic of the Sahara Desert. Ride camels into the sunset.",
    details:
      "Merzouga is a small Moroccan town in the Sahara Desert, near the Algerian border. It’s known as a gateway to Erg Chebbi, a huge expanse of sand dunes north of town. West of Merzouga, Dayet Srji is a seasonal salt lake that’s often dry in summer. When full, it attracts a wide range of migratory and desert birds, including desert warblers, Egyptian nightjars and flocks of flamingos.",
    highlights: [
      "Erg Chebbi Dunes",
      "Camel Trekking",
      "Star Gazing",
      "Berber Music",
    ],
  },
  {
    name: "Casablanca",
    title: "The White City",
    image:
      "https://images.unsplash.com/photo-1699210260093-e84e21d9b098?q=80&w=800&auto=format&fit=crop",
    desc: "The modern economic heart of Morocco, home to the majestic Hassan II Mosque.",
    details:
      "Casablanca is a port city and commercial hub in western Morocco, fronting the Atlantic Ocean. The city's French colonial legacy is seen in its downtown Mauresque architecture, a blend of Moorish style and European art deco. Standing partly over the water, the enormous Hassan II Mosque, completed in 1993, has a 210m minaret topped with lasers directed toward Mecca.",
    highlights: ["Hassan II Mosque", "Rick's Café", "Corniche", "Old Medina"],
  },
  {
    name: "Essaouira",
    title: "Wind City of Africa",
    image:
      "https://u.profitroom.pl/2020-mogadorhotels-com/thumb/0x1000/uploads/shutterstock_662426122.jpg",
    desc: "A charming coastal city known for fresh seafood, Gnaoua music, and kitesurfing.",
    details:
      "Essaouira is a port city and resort on Morocco’s Atlantic coast. Its medina (old town) is protected by 18th-century seafront ramparts called the Skala de la Kasbah, which were designed by European engineers. Old brass cannons line the walls, and there are ocean views. Strong 'Alizée' trade winds make the city’s crescent beach popular for surfing, windsurfing and kitesurfing.",
    highlights: [
      "Skala de la Ville",
      "Essaouira Beach",
      "Fish Market",
      "Gnaoua Festival",
    ],
  },
  {
    name: "Ouarzazate",
    title: "The Door of the Desert",
    image:
      "https://images.unsplash.com/photo-1580900893577-ac59dbd54a16?q=80&w=800&auto=format&fit=crop",
    desc: "A Hollywood favorite, known for its kasbahs and film studios.",
    details:
      "Ouarzazate is a city south of Morocco’s High Atlas mountains, known as a gateway to the Sahara Desert. Its huge Taourirt Kasbah, home to a 19th-century palace, has views over the rugged local landscape, which features in several movies. Northwest is the fortified red-earth city of Aït Benhaddou, while northeast is the rocky Todra Gorge. A road winds southeast through the lush Drâa Valley's palm groves to the desert.",
    highlights: [
      "Aït Benhaddou",
      "Atlas Studios",
      "Taourirt Kasbah",
      "Fint Oasis",
    ],
  },
  {
    name: "Tangier",
    title: "Gateway to Europe",
    image:
      "https://www.pinyourfootsteps.com/wp-content/uploads/2024/11/tangier_morocco-7-min-scaled.jpg",
    desc: "A historic gateway between Africa and Europe with a unique multicultural blend.",
    details:
      "Tangier, a Moroccan port on the Strait of Gibraltar, has been a strategic gateway between Africa and Europe since Phoenician times. Its whitewashed hillside medina is home to the Dar el Makhzen, a palace of the sultans that's now a museum of Moroccan artifacts. The American Legation Museum, also in the medina, documents early diplomatic relations between the U.S. and Morocco in an 1821 Moorish-style former consulate.",
    highlights: [
      "Caves of Hercules",
      "Cap Spartel",
      "Kasbah Museum",
      "Grand Socco",
    ],
  },
];

const HISTORY_EVENTS = [
  {
    year: "789 AD",
    title: "Idrisid Dynasty",
    desc: "Foundation of the Moroccan state by Idris I.",
  },
  {
    year: "1060",
    title: "Almoravids",
    desc: "Marrakech is founded and becomes the capital of an empire stretching to Spain.",
  },
  {
    year: "1666",
    title: "Alaouite Dynasty",
    desc: "The current ruling dynasty ascends to power.",
  },
  {
    year: "1912",
    title: "Protectorate",
    desc: "Treaty of Fes establishes French and Spanish protectorates.",
  },
  {
    year: "1956",
    title: "Independence",
    desc: "Morocco gains independence and King Mohammed V returns from exile.",
  },
];

const ESSENTIALS = [
  {
    icon: <Sun className="w-6 h-6" />,
    title: "Best Time",
    desc: "Spring (Mar-May) or Autumn (Sep-Nov) for the best weather.",
  },
  {
    icon: <Coffee className="w-6 h-6" />,
    title: "Tea Culture",
    desc: "Mint tea (Atay) is a sign of hospitality. Always accept it with a smile.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Languages",
    desc: "Darija (Arabic dialect) and Berber are native. French is widely spoken.",
  },
  {
    icon: <Camera className="w-6 h-6" />,
    title: "Etiquette",
    desc: "Ask before taking photos of people. Dress modestly in rural areas.",
  },
];

// --- Audio Utils ---

function floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// --- Components ---

// 1. Hero Section
const Hero = ({ onStart }: { onStart: () => void }) => (
  <div className="relative h-screen w-full overflow-hidden flex items-center justify-center text-white">
    <div className="absolute inset-0 z-0">
      <img
        src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1920&auto=format&fit=crop"
        alt="Morocco Desert"
        className="w-full h-full object-cover brightness-50 scale-105 animate-float"
      />
    </div>
    <div className="relative z-10 text-center px-4 max-w-4xl">
      <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg tracking-wide text-[#D4AF37]">
        Kingdom of Light
      </h1>
      <p className="text-xl md:text-2xl mb-10 font-light tracking-wider text-gray-100">
        Discover the magic, history, and soul of Morocco.
      </p>
      <button
        onClick={onStart}
        className="group bg-[#C0392B] hover:bg-[#a93226] text-white px-8 py-4 rounded-full text-lg transition-all duration-300 flex items-center gap-3 mx-auto shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
      >
        Start Journey{" "}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

// Trip Planning Form Component
const TripPlanningForm = ({
  cityName,
  onBack,
}: {
  cityName: string;
  onBack: () => void;
}) => {
  const [formData, setFormData] = useState({
    origin: "",
    destination: cityName,
    departure_date: "",
    return_date: "",
    travelers: 1,
    activities: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.origin.trim()) newErrors.origin = "Origin is required";
    if (!formData.departure_date)
      newErrors.departure_date = "Departure date is required";
    if (!formData.return_date)
      newErrors.return_date = "Return date is required";
    if (formData.travelers < 1)
      newErrors.travelers = "At least 1 traveler required";
    if (!formData.activities.trim())
      newErrors.activities = "Please specify your preferred activities";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.departure_date && formData.return_date) {
      if (new Date(formData.return_date) < new Date(formData.departure_date)) {
        newErrors.return_date = "Return date must be after departure date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(
        "https://ysssfff2005.app.n8n.cloud/webhook/morocco-trip-planner",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to submit");

      setSubmitStatus("success");
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          origin: "",
          destination: cityName,
          departure_date: "",
          return_date: "",
          travelers: 1,
          activities: "",
          email: "",
        });
        setSubmitStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#FFFBF0] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            type="button"
          >
            <ChevronRight size={24} className="rotate-180 text-gray-600" />
          </button>
          <div>
            <h3 className="text-3xl font-bold text-[#2C3E50]">
              Plan Your Trip
            </h3>
            <p className="text-[#C0392B] text-sm mt-1">
              Fill in your travel details
            </p>
          </div>
        </div>

        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-in slide-in-from-top-2">
            <p className="text-green-800 font-medium mb-2">
              🎉 Amazing! Your trip request has been received!
            </p>
            <p className="text-green-700 text-sm">
              Get ready for an unforgettable adventure! We'll send you a
              detailed email with a personalized itinerary for your trip to{" "}
              {cityName}. Check your inbox soon! ✈️
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-in slide-in-from-top-2">
            <p className="text-red-800 font-medium">
              ✗ Failed to submit. Please try again.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Origin */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Origin (Where are you traveling from?) *
            </label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => handleChange("origin", e.target.value)}
              placeholder="Enter your starting city"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.origin
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-[#0044CC]/20"
              }`}
            />
            {errors.origin && (
              <p className="text-red-500 text-xs mt-1">{errors.origin}</p>
            )}
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Destination
            </label>
            <input
              type="text"
              value={formData.destination}
              readOnly
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Departure Date *
              </label>
              <input
                type="date"
                value={formData.departure_date}
                onChange={(e) => handleChange("departure_date", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.departure_date
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#0044CC]/20"
                }`}
              />
              {errors.departure_date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.departure_date}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Return Date *
              </label>
              <input
                type="date"
                value={formData.return_date}
                onChange={(e) => handleChange("return_date", e.target.value)}
                min={
                  formData.departure_date ||
                  new Date().toISOString().split("T")[0]
                }
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.return_date
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-[#0044CC]/20"
                }`}
              />
              {errors.return_date && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.return_date}
                </p>
              )}
            </div>
          </div>

          {/* Travelers */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Number of Travelers *
            </label>
            <input
              type="number"
              value={formData.travelers}
              onChange={(e) =>
                handleChange("travelers", parseInt(e.target.value) || 1)
              }
              min="1"
              max="50"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.travelers
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-[#0044CC]/20"
              }`}
            />
            {errors.travelers && (
              <p className="text-red-500 text-xs mt-1">{errors.travelers}</p>
            )}
          </div>

          {/* Activities */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Preferred Activities *
            </label>
            <textarea
              value={formData.activities}
              onChange={(e) => handleChange("activities", e.target.value)}
              placeholder="e.g., Camel trekking, cultural tours, food experiences..."
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.activities
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-[#0044CC]/20"
              }`}
            />
            {errors.activities && (
              <p className="text-red-500 text-xs mt-1">{errors.activities}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="your.email@example.com"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-[#0044CC]/20"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2C3E50] text-white py-4 rounded-xl font-bold hover:bg-[#1a252f] transition-all transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Trip Request <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// New CityModal Component
const CityModal = ({
  city,
  onClose,
}: {
  city: (typeof CITIES)[0];
  onClose: () => void;
}) => {
  const [showForm, setShowForm] = useState(false);

  if (!city) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl overflow-hidden max-w-5xl w-full max-h-[90vh] shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {!showForm ? (
          <>
            <div className="w-full md:w-1/2 h-64 md:h-auto relative group">
              <img
                src={city.image}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-none"></div>
              <div className="absolute bottom-4 left-4 md:hidden text-white">
                <h3 className="text-3xl font-bold">{city.name}</h3>
                <p className="text-[#D4AF37] font-medium">{city.title}</p>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-10 overflow-y-auto bg-[#FFFBF0]">
              <div className="flex justify-between items-start mb-6">
                <div className="hidden md:block">
                  <h3 className="text-4xl font-cinzel font-bold text-[#2C3E50]">
                    {city.name}
                  </h3>
                  <p className="text-[#C0392B] font-medium text-lg mt-1">
                    {city.title}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8 text-lg font-light">
                {city.details}
              </p>

              <div className="mb-8">
                <h4 className="font-bold text-[#0044CC] mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                  <MapPin size={20} /> Key Highlights
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {city.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-lg shadow-sm border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-colors"
                    >
                      <div className="w-2 h-2 bg-[#D4AF37] rounded-full flex-shrink-0"></div>
                      <span className="text-sm font-medium">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Create a new window with the form
                    const newWindow = window.open(
                      "",
                      "_blank",
                      "width=800,height=900"
                    );
                    if (newWindow) {
                      newWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>Plan Your Trip to ${city.name}</title>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <script src="https://cdn.tailwindcss.com"></script>
                            <style>
                              body { font-family: system-ui, -apple-system, sans-serif; }
                            </style>
                          </head>
                          <body class="bg-[#FFFBF0] p-8">
                            <div id="form-root"></div>
                            <script type="module">
                              const cityName = "${city.name}";
                              const formRoot = document.getElementById('form-root');
                              
                              let formData = {
                                origin: '',
                                destination: cityName,
                                departure_date: '',
                                return_date: '',
                                travelers: 1,
                                activities: '',
                                email: ''
                              };
                              
                              let errors = {};
                              let isSubmitting = false;
                              let submitStatus = 'idle';
                              
                              function validateForm() {
                                const newErrors = {};
                                if (!formData.origin.trim()) newErrors.origin = 'Origin is required';
                                if (!formData.departure_date) newErrors.departure_date = 'Departure date is required';
                                if (!formData.return_date) newErrors.return_date = 'Return date is required';
                                if (formData.travelers < 1) newErrors.travelers = 'At least 1 traveler required';
                                if (!formData.activities.trim()) newErrors.activities = 'Please specify your preferred activities';
                                if (!formData.email.trim()) {
                                  newErrors.email = 'Email is required';
                                } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
                                  newErrors.email = 'Please enter a valid email address';
                                }
                                if (formData.departure_date && formData.return_date) {
                                  if (new Date(formData.return_date) < new Date(formData.departure_date)) {
                                    newErrors.return_date = 'Return date must be after departure date';
                                  }
                                }
                                errors = newErrors;
                                return Object.keys(newErrors).length === 0;
                              }
                              
                              async function handleSubmit(e) {
                                e.preventDefault();
                                if (!validateForm()) {
                                  updateErrors();
                                  return;
                                }
                                
                                isSubmitting = true;
                                submitStatus = 'idle';
                                const submitBtn = document.getElementById('submit-btn');
                                if (submitBtn) {
                                  submitBtn.disabled = true;
                                  submitBtn.innerHTML = '<div class="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div> Submitting...';
                                }
                                
                                try {
                                  const response = await fetch('https://ysssfff2005.app.n8n.cloud/webhook/morocco-trip-planner', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(formData)
                                  });
                                  
                                  if (!response.ok) throw new Error('Failed to submit');
                                  
                                  submitStatus = 'success';
                                  updateStatus();
                                  
                                  setTimeout(() => {
                                    // Reset form fields
                                    document.getElementById('origin').value = '';
                                    document.getElementById('departure_date').value = '';
                                    document.getElementById('return_date').value = '';
                                    document.getElementById('travelers').value = '1';
                                    document.getElementById('activities').value = '';
                                    document.getElementById('email').value = '';
                                    
                                    formData = {
                                      origin: '',
                                      destination: cityName,
                                      departure_date: '',
                                      return_date: '',
                                      travelers: 1,
                                      activities: '',
                                      email: ''
                                    };
                                    submitStatus = 'idle';
                                    updateStatus();
                                  }, 5000);
                                } catch (error) {
                                  console.error('Form submission error:', error);
                                  submitStatus = 'error';
                                  updateStatus();
                                } finally {
                                  isSubmitting = false;
                                  if (submitBtn) {
                                    submitBtn.disabled = false;
                                    submitBtn.innerHTML = 'Submit Trip Request →';
                                  }
                                }
                              }
                              
                              function handleChange(field, value) {
                                formData[field] = value;
                                if (errors[field]) {
                                  delete errors[field];
                                  updateErrors();
                                }
                              }
                              
                              function updateErrors() {
                                // Update error messages without re-rendering entire form
                                const fields = ['origin', 'departure_date', 'return_date', 'travelers', 'activities', 'email'];
                                fields.forEach(field => {
                                  const errorElement = document.getElementById(\`\${field}-error\`);
                                  if (errorElement) {
                                    if (errors[field]) {
                                      errorElement.textContent = errors[field];
                                      errorElement.style.display = 'block';
                                      const input = document.getElementById(field);
                                      if (input) {
                                        input.className = input.className.replace('border-gray-300 focus:ring-[#0044CC]/20', 'border-red-500 focus:ring-red-200');
                                      }
                                    } else {
                                      errorElement.style.display = 'none';
                                      const input = document.getElementById(field);
                                      if (input) {
                                        input.className = input.className.replace('border-red-500 focus:ring-red-200', 'border-gray-300 focus:ring-[#0044CC]/20');
                                      }
                                    }
                                  }
                                });
                              }
                              
                              function updateStatus() {
                                const statusContainer = document.getElementById('status-container');
                                if (!statusContainer) return;
                                
                                if (submitStatus === 'success') {
                                  statusContainer.innerHTML = \`
                                    <div class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                                      <p class="text-green-800 font-medium mb-2">🎉 Request Received!</p>
                                      <p class="text-green-700 text-sm">You will receive an email planning your trip to your address.</p>
                                    </div>
                                  \`;
                                } else if (submitStatus === 'error') {
                                  statusContainer.innerHTML = \`
                                    <div class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                      <p class="text-red-800 font-medium">✗ Failed to submit. Please try again.</p>
                                    </div>
                                  \`;
                                } else {
                                  statusContainer.innerHTML = '';
                                }
                              }
                              
                              function render() {
                                formRoot.innerHTML = \`
                                  <div class="max-w-2xl mx-auto">
                                    <div class="mb-6">
                                      <h1 class="text-3xl font-bold text-[#2C3E50]">Plan Your Trip to \${cityName}</h1>
                                      <p class="text-[#C0392B] text-sm mt-1">Fill in your travel details</p>
                                    </div>
                                    
                                    <div id="status-container"></div>
                                    
                                    <form id="trip-form" class="space-y-5">
                                      <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-2">Origin (Where are you traveling from?) *</label>
                                        <input type="text" id="origin" dir="ltr" autocomplete="off" placeholder="Enter your starting city" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0044CC]/20 transition-all" />
                                        <p id="origin-error" class="text-red-500 text-xs mt-1" style="display: none;"></p>
                                      </div>
                                      
                                      <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-2">Destination</label>
                                        <input type="text" value="\${formData.destination}" readonly class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600 cursor-not-allowed" />
                                      </div>
                                      
                                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                          <label class="block text-sm font-bold text-gray-700 mb-2">Departure Date *</label>
                                          <input type="date" id="departure_date" min="\${new Date().toISOString().split('T')[0]}" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0044CC]/20 transition-all" />
                                          <p id="departure_date-error" class="text-red-500 text-xs mt-1" style="display: none;"></p>
                                        </div>
                                        <div>
                                          <label class="block text-sm font-bold text-gray-700 mb-2">Return Date *</label>
                                          <input type="date" id="return_date" min="\${new Date().toISOString().split('T')[0]}" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0044CC]/20 transition-all" />
                                          <p id="return_date-error" class="text-red-500 text-xs mt-1" style="display: none;"></p>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-2">Number of Travelers *</label>
                                        <input type="number" id="travelers" value="1" min="1" max="50" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0044CC]/20 transition-all" />
                                        <p id="travelers-error" class="text-red-500 text-xs mt-1" style="display: none;"></p>
                                      </div>
                                      
                                      <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-2">Preferred Activities *</label>
                                        <textarea id="activities" dir="ltr" autocomplete="off" placeholder="e.g., Camel trekking, cultural tours, food experiences..." rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0044CC]/20 transition-all resize-none"></textarea>
                                        <p id="activities-error" class="text-red-500 text-xs mt-1" style="display: none;"></p>
                                      </div>
                                      
                                      <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                                        <input type="email" id="email" dir="ltr" autocomplete="off" placeholder="your.email@example.com" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0044CC]/20 transition-all" />
                                        <p id="email-error" class="text-red-500 text-xs mt-1" style="display: none;"></p>
                                      </div>
                                      
                                      <div class="pt-4">
                                        <button type="submit" id="submit-btn" class="w-full bg-[#2C3E50] text-white py-4 rounded-xl font-bold hover:bg-[#1a252f] transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2">
                                          Submit Trip Request →
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                \`;
                                
                                const form = document.getElementById('trip-form');
                                if (form) {
                                  form.addEventListener('submit', handleSubmit);
                                  document.getElementById('origin')?.addEventListener('input', (e) => handleChange('origin', e.target.value));
                                  document.getElementById('departure_date')?.addEventListener('input', (e) => handleChange('departure_date', e.target.value));
                                  document.getElementById('return_date')?.addEventListener('input', (e) => handleChange('return_date', e.target.value));
                                  document.getElementById('travelers')?.addEventListener('input', (e) => handleChange('travelers', parseInt(e.target.value) || 1));
                                  document.getElementById('activities')?.addEventListener('input', (e) => handleChange('activities', e.target.value));
                                  document.getElementById('email')?.addEventListener('input', (e) => handleChange('email', e.target.value));
                                }
                              }
                              
                              render();
                            </script>
                          </body>
                        </html>
                      `);
                      newWindow.document.close();
                    }
                  }}
                  className="w-full bg-[#2C3E50] text-white py-4 rounded-xl font-bold hover:bg-[#1a252f] transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2 group"
                >
                  Plan a Trip to {city.name}{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-200 transition-colors bg-white/80 backdrop-blur-sm"
            >
              <X size={24} className="text-gray-600" />
            </button>
            <TripPlanningForm
              cityName={city.name}
              onBack={() => setShowForm(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Cities Section
const CitiesView = () => {
  const [selectedCity, setSelectedCity] = useState<(typeof CITIES)[0] | null>(
    null
  );

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-[#C0392B] mb-2 text-center">
        Iconic Cities
      </h2>
      <p className="text-gray-600 text-center mb-12 italic">
        From the Atlantic coast to the Sahara dunes
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CITIES.map((city, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedCity(city)}
            className="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-b-4 border-[#D4AF37]/0 hover:border-[#D4AF37]"
          >
            <img
              src={city.image}
              alt={city.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

            <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-2xl text-white font-bold mb-1 translate-y-0 transition-transform duration-300 group-hover:-translate-y-1">
                {city.name}
              </h3>
              <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-3">
                {city.title}
              </p>
              <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2 leading-relaxed">
                  {city.desc}
                </p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs text-white font-bold border border-white/30 px-3 py-1.5 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors">
                  Explore <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCity && (
        <CityModal city={selectedCity} onClose={() => setSelectedCity(null)} />
      )}
    </div>
  );
};

// 3. History Section
const HistoryView = () => (
  <div className="py-12 px-6 md:px-12 bg-white/80 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full pattern-bg opacity-5 pointer-events-none"></div>
    <div className="max-w-5xl mx-auto relative z-10">
      <h2 className="text-4xl font-bold text-[#0044CC] mb-12 text-center">
        Timeline of Ages
      </h2>

      <div className="relative border-l-4 border-[#D4AF37]/30 ml-6 md:ml-1/2 space-y-12">
        {HISTORY_EVENTS.map((event, idx) => (
          <div key={idx} className="relative pl-8 md:pl-12">
            <div className="absolute -left-3.5 top-1 w-6 h-6 bg-[#C0392B] rounded-full border-4 border-white shadow-md"></div>
            <div className="bg-[#FFFBF0] p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-[#D4AF37]/20">
              <span className="text-[#C0392B] font-bold text-xl block mb-1">
                {event.year}
              </span>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {event.title}
              </h3>
              <p className="text-gray-600">{event.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 4. Essentials Section
const EssentialsView = () => (
  <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
    <h2 className="text-4xl font-bold text-[#2C3E50] mb-12 text-center">
      Traveler Essentials
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {ESSENTIALS.map((item, idx) => (
        <div
          key={idx}
          className="bg-white p-8 rounded-2xl shadow-lg text-center hover:-translate-y-2 transition-transform duration-300 border-b-4 border-[#0044CC]"
        >
          <div className="w-14 h-14 bg-[#E6EEFA] text-[#0044CC] rounded-full flex items-center justify-center mx-auto mb-4">
            {item.icon}
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
          <p className="text-gray-600 text-sm">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

// --- n8n Integration Components ---

// 6. Floating Action Buttons
const FloatingActionButtons = ({
  onChatClick,
  onVoiceClick,
}: {
  onChatClick: () => void;
  onVoiceClick: () => void;
}) => (
  <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
    <button
      onClick={onVoiceClick}
      className="bg-[#C0392B] hover:bg-[#a93226] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center"
      title="Talk to AI Agent"
    >
      <Mic size={24} />
    </button>
    <button
      onClick={onChatClick}
      className="bg-[#0044CC] hover:bg-[#003399] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center"
      title="Chat with AI"
    >
      <MessageCircle size={24} />
    </button>
  </div>
);

// 7. n8n Chat Modal (Restored & Improved)
const N8nChatModal = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([
    {
      role: "bot",
      text: "Hello! I am your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [sessionId] = useState(
    "session-" + Math.random().toString(36).substring(7)
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_N8N_CHAT_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          sessionId: sessionId,
          chatInput: userMsg,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse =
        data.output ||
        data.message ||
        data.text ||
        (Array.isArray(data) && data[0]?.output) ||
        JSON.stringify(data);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            typeof botResponse === "string"
              ? botResponse
              : JSON.stringify(botResponse),
        },
      ]);
    } catch (error) {
      console.error("n8n Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Sorry, I encountered an error connecting to the workflow.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-none">
      <div
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={onClose}
      ></div>
      <div className="relative z-10 bg-white w-full max-w-md h-[600px] rounded-2xl shadow-2xl flex flex-col pointer-events-auto animate-in slide-in-from-bottom-10 duration-300 overflow-hidden">
        <div className="bg-[#0044CC] p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold">AI Assistant</h3>
              <p className="text-xs text-blue-200">Powered by n8n</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === "user"
                    ? "bg-[#0044CC] text-white rounded-tr-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0044CC]/20"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-[#0044CC] text-white p-2 rounded-full hover:bg-[#003399] disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---

const VoiceAgentButton = () => {
  const { startSession, endSession, status, isSpeaking } = useConversation();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleStartCall = async () => {
    try {
      setError(null);
      setIsConnecting(true);
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation session
      await startSession({
        agentId: 'agent_8201k9pp5feqf0g8kb0wpj6z3jft',
        connectionType: 'webrtc',
      });
      setIsSessionActive(true);
      setIsConnecting(false);
    } catch (err: any) {
      setError(err.message || 'Failed to start voice session');
      setIsConnecting(false);
      setIsSessionActive(false);
    }
  };

  const handleEndCall = async () => {
    await endSession();
    setIsSessionActive(false);
    setIsMuted(false);
  };

  const toggleMute = () => {
    // Note: Actual mute implementation would require additional API from useConversation
    setIsMuted(!isMuted);
  };

  const isConnected = status === 'connected';

  const buttonColor = isConnected ? 'bg-[#C0392B]' : 'bg-[#0044CC]';
  const hoverColor = isConnected ? 'hover:bg-[#a93226]' : 'hover:bg-[#003399]';

  let icon = <Mic size={24} />;
  let title = "Talk to Voice Agent";

  if (isConnecting) {
    title = "Connecting...";
  } else if (isSpeaking) {
    icon = <Volume2 size={24} className="animate-pulse" />;
    title = "Agent is speaking...";
  } else if (isConnected) {
    icon = <Mic size={24} className="animate-pulse" />;
    title = "Listening...";
  }

  return (
    <>
      {/* Popup Modal - Shows when connected */}
      {isConnected && (
        <div className="fixed bottom-48 right-6 z-[60] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 max-w-[calc(100vw-3rem)]">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#C0392B] to-[#a93226] rounded-full mb-4">
                {isSpeaking ? (
                  <Volume2 size={32} className="text-white animate-pulse" />
                ) : (
                  <Mic size={32} className="text-white animate-pulse" />
                )}
              </div>
              <h3 className="text-2xl font-cinzel font-bold text-gray-900 mb-2">
                ✨ Your AI Travel Guide
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                I'm here to help you discover Morocco's magic! Ask me anything about destinations,
                activities, or let me help you plan your perfect Moroccan adventure. 🌟
              </p>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-green-700 font-medium text-sm">
                {isSpeaking ? "🎙️ Agent Speaking..." : "👂 Listening to you..."}
              </span>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-3 justify-center">
              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${isMuted
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                <span className="text-sm">{isMuted ? "Unmute" : "Mute"}</span>
              </button>

              {/* End Call Button */}
              <button
                onClick={handleEndCall}
                className="flex items-center gap-2 px-6 py-3 bg-[#C0392B] hover:bg-[#a93226] text-white rounded-full font-medium transition-all transform hover:scale-105 shadow-lg"
                title="End Call"
              >
                <X size={20} />
                <span className="text-sm">End Call</span>
              </button>
            </div>

            {/* Fun Tip */}
            <div className="mt-6 p-4 bg-[#FFFBF0] rounded-lg border border-[#D4AF37]/30">
              <p className="text-xs text-gray-600 text-center">
                💡 <strong>Tip:</strong> Try saying "I want to visit the Sahara Desert" or
                "What's the best time to visit Marrakech?"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Button */}
      <div className="flex flex-col items-center gap-2">
        {error && <div className="text-red-500 text-xs bg-white p-2 rounded-md shadow-md max-w-[200px] text-center">{error}</div>}
        <button
          onClick={handleStartCall}
          className={`${buttonColor} ${hoverColor} text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center relative`}
          title={title}
          disabled={isConnecting || isConnected}
        >
          {isConnecting ? (
            <span className="flex h-6 w-6 relative items-center justify-center">
              <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
            </span>
          ) : (
            icon
          )}
          {isConnected && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          )}
        </button>
      </div>
    </>
  );
};

const App = () => {
  const [view, setView] = useState<"hero" | "explore">("hero");
  const [activeSection, setActiveSection] = useState("cities");

  useEffect(() => {
    if (view === "explore" && !document.getElementById("n8n-chat-script")) {
      const script = document.createElement("script");
      script.id = "n8n-chat-script";
      script.type = "module";
      script.innerHTML = `
        import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
        createChat({
          webhookUrl: '${import.meta.env.VITE_N8N_CHAT_WEBHOOK}',
          target: '#n8n-chat-container'
        });
      `;
      document.body.appendChild(script);
    }
  }, [view]);

  if (view === "hero") {
    return <Hero onStart={() => setView("explore")} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF0] text-gray-800 font-sans relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setView("hero")}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Morocco.svg"
                alt="Morocco Flag"
                className="w-10 h-10 rounded-tr-xl rounded-bl-xl object-cover mr-3 shadow-md"
              />
              <span className="font-cinzel font-bold text-2xl text-gray-900 tracking-tight">
                Morocco<span className="text-[#C0392B]">.</span>
              </span>
            </div>

            <div className="hidden md:flex space-x-8">
              {["cities", "history", "essentials"].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`font-cinzel font-medium text-sm uppercase tracking-wider transition-colors ${
                    activeSection === section
                      ? "text-[#C0392B] border-b-2 border-[#C0392B]"
                      : "text-gray-500 hover:text-[#C0392B]"
                  } pb-1`}
                >
                  {section}
                </button>
              ))}
            </div>

            {/* Mobile menu button placeholder */}
            <div className="md:hidden">
              <Menu className="text-gray-600" />
            </div>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="flex-1 relative">
        <div className="absolute top-0 left-0 w-full h-full pattern-bg opacity-[0.03] pointer-events-none z-0"></div>

        <div className="relative z-10">
          {activeSection === "cities" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <CitiesView />
            </div>
          )}

          {activeSection === "history" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <HistoryView />
            </div>
          )}

          {activeSection === "essentials" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <EssentialsView />
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-28 right-6 flex flex-col gap-4 z-50 items-end">
        <div className="relative group">
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-xl shadow-lg text-gray-800 font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Speak with our agent
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white transform rotate-45"></div>
          </div>
          <button
            onClick={() => setIsN8nVoiceOpen(true)}
            className="bg-[#C0392B] hover:bg-[#a93226] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center"
            title="Speak with our agent"
          >
            <Mic size={24} />
          </button>
        </div>
      </div>

      {/* n8n Modals */}
      {isN8nVoiceOpen && (
        <N8nVoiceModal onClose={() => setIsN8nVoiceOpen(false)} />
      )}

      {/* n8n Chat Widget Container */}
      <div
        id="n8n-chat-container"
        className="fixed bottom-6 right-6 z-50"
      ></div>

      {/* ElevenLabs Voice Widget - Positioned above chat button */}
      <div className="fixed bottom-28 right-6 z-50">
        <VoiceAgentButton />
      </div>

      {/* Footer */}
      <footer className="bg-[#2C3E50] text-white py-12 border-t-8 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-cinzel text-2xl font-bold mb-4">Morocco.</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A project dedicated to showing the beauty, history, and warmth of
              Moroccan culture to the world.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[#F5E6CA]">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li
                onClick={() => setActiveSection("cities")}
                className="hover:text-white cursor-pointer transition-colors"
              >
                Top Destinations
              </li>
              <li
                onClick={() => setActiveSection("history")}
                className="hover:text-white cursor-pointer transition-colors"
              >
                Cultural Heritage
              </li>
              <li
                onClick={() => setActiveSection("essentials")}
                className="hover:text-white cursor-pointer transition-colors"
              >
                Travel Tips
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-12 text-gray-500 text-xs">
          © {new Date().getFullYear()} Discover Morocco. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
