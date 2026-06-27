import Medicine from '../models/medicineModel.js';

export const seedDatabase = async () => {
    try {
        console.log("Clearing and reseeding database with premium medicines...");
        
        const medicines = [
            {
                name: "Panadol 500mg (Paracetamol)",
                brand: "GSK",
                price: 30,
                image: "panadol.png",
                category: "OTC Medicine",
                type: "Tablet",
                description: "Panadol provides fast and effective relief of temporary pain and fever, including headache, toothache, and muscle ache.",
                stock: 250
            },
            {
                name: "Napa 500mg Paracetamol",
                brand: "Beximco",
                price: 25,
                image: "napa.png",
                category: "OTC Medicine",
                type: "Tablet",
                description: "Napa (Paracetamol) is widely used for rapid relief of mild-to-moderate pain, fever, and symptoms of colds and flu.",
                stock: 300
            },
            {
                name: "Arinac Forte",
                brand: "Abbott",
                price: 85,
                image: "arcinic.png",
                category: "Prescription Medicine",
                type: "Tablet",
                description: "Arinac Forte provides relief from nasal congestion, sinus pressure, fever, headache, and body aches associated with the common cold.",
                stock: 120
            },
            {
                name: "Fexo 120mg Allergy Relief",
                brand: "Square Pharma",
                price: 150,
                image: "fexo.png",
                category: "OTC Medicine",
                type: "Tablet",
                description: "Fexo (Fexofenadine Hydrochloride) is a non-drowsy antihistamine that provides fast 24-hour relief from seasonal allergy symptoms.",
                stock: 180
            },
            {
                name: "Sergel 20mg Capsule",
                brand: "Healthcare Pharma",
                price: 140,
                image: "sergel.png",
                category: "OTC Medicine",
                type: "Capsule",
                description: "Sergel (Esomeprazole) is indicated for acid reflux, gastroesophageal reflux disease (GERD), and healing of erosive esophagitis.",
                stock: 150
            },
            {
                name: "Omezol 20mg Capsule",
                brand: "Ziska Pharma",
                price: 120,
                image: "omezol.png",
                category: "OTC Medicine",
                type: "Capsule",
                description: "Omezol (Omeprazole) effectively reduces stomach acid production, treating heartburn, GERD, and gastric ulcers.",
                stock: 200
            },
            {
                name: "Surbex-Z Immunity booster",
                brand: "Abbott",
                price: 240,
                image: "surbex_z.png",
                category: "Supplement",
                type: "Tablet",
                description: "Surbex-Z is a high potency B-complex with Zinc supplement formulated to replenish essential nutrients and support active immune health.",
                stock: 100
            },
            {
                name: "Ceevit 250mg Chewable",
                brand: "Square Pharma",
                price: 90,
                image: "ceevit.png",
                category: "Supplement",
                type: "Tablet",
                description: "Ceevit Chewable Vitamin C tablets boost immunity, promote healthy skin, and act as a powerful daily antioxidant helper.",
                stock: 140
            },
            {
                name: "High Potency B-Complex Vitamin",
                brand: "Nature's Bounty",
                price: 1250,
                image: "B_Complex.png",
                category: "Supplement",
                type: "Capsule",
                description: "High potency Vitamin B-Complex containing all essential B vitamins to support cellular energy production and nervous system health.",
                stock: 80
            },
            {
                name: "T-Up Testosterone Supplement",
                brand: "Nutrex Research",
                price: 4200,
                image: "T_UP_Supplement.png",
                category: "Supplement",
                type: "Capsule",
                description: "T-UP contains Sodium D-Aspartic Acid, scientifically proven to boost natural testosterone levels to enhance strength and training volume.",
                stock: 45
            },
            {
                name: "Vital Omega-3 Fish Oil",
                brand: "Kirkland",
                price: 3100,
                image: "vital_omega3_fish_oil.png",
                category: "Supplement",
                type: "Capsule",
                description: "Premium fish oil supplement containing rich EPA and DHA fatty acids to promote cardiovascular, joint, and brain health.",
                stock: 60
            },
            {
                name: "Magnesium Glycinate 500mg",
                brand: "Solaray",
                price: 2600,
                image: "magnesium_gycinate.png",
                category: "Supplement",
                type: "Capsule",
                description: "Highly bioavailable Magnesium Glycinate for muscle relaxation, bone health support, and improved sleep quality.",
                stock: 75
            },
            {
                name: "BioSchwartz Magnesium Complex",
                brand: "BioSchwartz",
                price: 2400,
                image: "magnesium_supplement.png",
                category: "Supplement",
                type: "Capsule",
                description: "Magnesium Complex featuring multiple forms of magnesium to aid muscle performance, stress relief, and heart function.",
                stock: 90
            },
            {
                name: "Methylcobalamin B12 Active",
                brand: "Solgar",
                price: 1850,
                image: "mythyl.png",
                category: "Supplement",
                type: "Tablet",
                description: "Active, coenzyme form of Vitamin B12 to promote red blood cell formation, cognitive function, and energy metabolism.",
                stock: 110
            },
            {
                name: "Probiotic Digestive Support",
                brand: "Culturelle",
                price: 2850,
                image: "probiotic.png",
                category: "Supplement",
                type: "Capsule",
                description: "Daily probiotic supplement containing 10 billion active cultures to restore digestive balance and support digestive wellness.",
                stock: 50
            },
            {
                name: "Premium Whey Protein Isolate",
                brand: "Optimum Nutrition",
                price: 8500,
                image: "whey_suplement.png",
                category: "Supplement",
                type: "Powder",
                description: "Premium 100% Whey Protein Isolate for rapid muscle recovery, lean muscle growth, and post-workout nutritional replenishment.",
                stock: 35
            },
            {
                name: "Caffeine Clean Focus Energy",
                brand: "PrimaForce",
                price: 1450,
                image: "caffeine.png",
                category: "Supplement",
                type: "Tablet",
                description: "Provides clean energy, mental focus, and thermogenic support without jitters. Ideal pre-workout or pre-study aid.",
                stock: 120
            },
            {
                name: "Aloe Vera Soothing Gel 99%",
                brand: "Holika Holika",
                price: 890,
                image: "aloe_vera.png",
                category: "Personal Care",
                type: "Syrup",
                description: "Fermented Aloe Vera soothing gel provides cooling hydration, relieves skin irritation, and sunburns.",
                stock: 150
            },
            {
                name: "Dermalogica Daily Microfoliant",
                brand: "Dermalogica",
                price: 5200,
                image: "dermalogica.png",
                category: "Personal Care",
                type: "Powder",
                description: "Gentle, rice-based exfoliating powder activates upon contact with water, leaving skin smoother and brighter.",
                stock: 40
            },
            {
                name: "Good Genes Lactic Acid",
                brand: "Sunday Riley",
                price: 6800,
                image: "good_genes_skin_syrum.png",
                category: "Personal Care",
                type: "Syrup",
                description: "Clinically proven lactic acid treatment that instantly plumps fine lines and exfoliates dull skin for a radiant glow.",
                stock: 25
            },
            {
                name: "Luna Retinol Sleeping Night Oil",
                brand: "Sunday Riley",
                price: 7200,
                image: "luna_skin_syrum.png",
                category: "Personal Care",
                type: "Syrup",
                description: "Next-generation retinol oil that reduces appearance of pores, wrinkles, and redness while you sleep.",
                stock: 30
            },
            {
                name: "The Ordinary Niacinamide 10%",
                brand: "Deciem",
                price: 1950,
                image: "ordinary_syrup.png",
                category: "Personal Care",
                type: "Syrup",
                description: "High-strength vitamin and mineral blemish formula with 10% Niacinamide and 1% Zinc PCA to regulate sebum production.",
                stock: 140
            },
            {
                name: "Baby Glow Nourishing Lotion",
                brand: "Johnson & Johnson",
                price: 950,
                image: "baby_glow.png",
                category: "Baby Care",
                type: "Syrup",
                description: "Gentle baby lotion formulated to nourish and protect sensitive baby skin, keeping it soft and glowing for 24 hours.",
                stock: 85
            },
            {
                name: "Enfamil Baby Formula Milk",
                brand: "Mead Johnson",
                price: 3800,
                image: "emafil.png",
                category: "Baby Care",
                type: "Powder",
                description: "Infant baby formula with dual prebiotics and brain-building DHA to support immune and cognitive development.",
                stock: 65
            },
            {
                name: "Digital Blood Pressure Monitor",
                brand: "Omron",
                price: 4800,
                image: "blood_pressure_measurer.png",
                category: "Devices",
                type: "Tablet",
                description: "Fully automatic upper-arm digital blood pressure monitor with Intellisense technology for accurate readings.",
                stock: 50
            },
            {
                name: "Glucometer Test Strips Active",
                brand: "Accu-Chek",
                price: 1650,
                image: "biabetic-care.png",
                category: "Diabetic Care",
                type: "Tablet",
                description: "Accu-Chek Active test strips for quick, hygienic, and highly accurate blood glucose testing.",
                stock: 130
            },
            {
                name: "Medical Equipment First Aid Kit",
                brand: "Medline",
                price: 2900,
                image: "equipment.png",
                category: "Devices",
                type: "Tablet",
                description: "Comprehensive first aid kit containing essential medical equipment, bandages, antiseptics, and tools.",
                stock: 90
            }
        ];
        
        await Medicine.deleteMany({});
        await Medicine.insertMany(medicines);
        console.log("Seeding completed successfully with 27 premium products!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};
