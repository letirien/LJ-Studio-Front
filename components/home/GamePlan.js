import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function BrandingSection({ gamePlan }) {
  // État pour suivre la catégorie active
  const [activeCategory, setActiveCategory] = useState("");
  const [activePlanData, setActivePlanData] = useState(null);
  const [sortedGamePlan, setSortedGamePlan] = useState([]);

  useEffect(() => {
    if (gamePlan && gamePlan.length > 0) {
      // Sort the game plan by ID field
      const sorted = [...gamePlan].sort((a, b) => {
        // Convert to numbers to ensure proper numeric sorting
        const idA = parseInt(a.fields.id, 10);
        const idB = parseInt(b.fields.id, 10);
        return idB - idA;
      });
      
      setSortedGamePlan(sorted);
      // Par défaut, utiliser la première catégorie du plan trié
      setActiveCategory(sorted[gamePlan.length - 2].fields.Plan);
      setActivePlanData(sorted[gamePlan.length - 2]);
    }
  }, [gamePlan]);
  
  // Extraire toutes les catégories uniques à partir des données triées
  const uniqueCategories = sortedGamePlan.length > 0 
    ? [...new Set(sortedGamePlan.map(item => item.fields.Plan))]
    : [];
  
  // Fonction pour changer de catégorie
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    const matchingItem = sortedGamePlan.find(item => item.fields.Plan === category);
    if (matchingItem) {
      setActivePlanData(matchingItem);
    }
  };
  
  // Si les données ne sont pas encore chargées
  if (sortedGamePlan.length === 0 || !activeCategory) {
    return <div>Loading...</div>;
  }
  
  return (
    <section className="bg-white py-42 intersectLogo white">
      {/* Container with relative positioning for absolute elements */}
      <div className="max-w-screen-2xl mx-auto h-full relative">
        {/* Navigation verticale à gauche - absolument positionnée */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <div className="flex flex-col space-y-16 items-center uppercase">
            {uniqueCategories.map((category) => (
              <div 
                key={category}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleCategoryChange(category)}
              >
                <span 
                  className={`text-xs ${
                    activeCategory === category ? 'font-medium harbop text-light text-[42px] text-gray-400' : 'roboto text-gray-300'
                  }`}
                  style={{ 
                    writingMode: 'vertical-lr', 
                    textOrientation: 'mixed',
                    transform: 'rotate(180deg)'
                  }}
                >
                  {category}
                </span>
                
              </div>
            ))}
          </div>
        </div>
        
        {/* Le contenu principal centré */}
        <div className="flex justify-around gap-4">
          {/* Image centrée */}
          <div className="w-full max-w-lg mb-12">
            <div className="relative h-full w-full">
              {activePlanData && activePlanData.fields.Image && activePlanData.fields.Image[0] && (
                <div className="relative image-plan">
                  <Image
                    src={activePlanData.fields.Image[0].url}
                    alt={activePlanData.fields.Title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-sm"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Texte centré */}
          <div className="w-full max-w-lg">
            <h2 className="hardbop-bold text-[#000] text-[180px] text-base/36 uppercase font-bold tracking-tight">
              {activePlanData.fields.Title}
            </h2>
            
            <div className="mt-8">
              <h3 className="hardbop-bold text-[#000] text-[72px] text-base/23 uppercase text-gray-500 font-medium mb-6">
                {activePlanData.fields.Plan}
              </h3>
              
              <div className="w-full my-6 h-px bg-gray-300"></div>
              
              <p className="text-gray-300 roboto text-medium">
                {activePlanData.fields.Description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}