import { api, BASE_URL } from './api';

// Import all local medicine assets
import bComplexImg from '../assets/images/B_Complex.png';
import tUpSupplementImg from '../assets/images/T_UP_Supplement.png';
import aloeVeraImg from '../assets/images/aloe_vera.png';
import arinacImg from '../assets/images/arcinic.png';
import babyGlowImg from '../assets/images/baby_glow.png';
import diabeticCareImg from '../assets/images/biabetic-care.png';
import bloodPressureImg from '../assets/images/blood_pressure_measurer.png';
import caffeineImg from '../assets/images/caffeine.png';
import ceevitImg from '../assets/images/ceevit.png';
import dermalogicaImg from '../assets/images/dermalogica.png';
import enfamilImg from '../assets/images/emafil.png';
import equipmentImg from '../assets/images/equipment.png';
import fexoImg from '../assets/images/fexo.png';
import goodGenesImg from '../assets/images/good_genes_skin_syrum.png';
import lunaOilImg from '../assets/images/luna_skin_syrum.png';
import magnesiumGlycinateImg from '../assets/images/magnesium_gycinate.png';
import magnesiumSupplementImg from '../assets/images/magnesium_supplement.png';
import methylcobalaminImg from '../assets/images/mythyl.png';
import napaImg from '../assets/images/napa.png';
import omezolImg from '../assets/images/omezol.png';
import ordinaryNiacinamideImg from '../assets/images/ordinary_syrup.png';
import panadolImg from '../assets/images/panadol.png';
import probioticImg from '../assets/images/probiotic.png';
import sergelImg from '../assets/images/sergel.png';
import vitalOmega3Img from '../assets/images/vital_omega3_fish_oil.png';
import wheySupplementImg from '../assets/images/whey_suplement.png';

const IMAGE_MAP = {
    'B_Complex.png': bComplexImg,
    'T_UP_Supplement.png': tUpSupplementImg,
    'aloe_vera.png': aloeVeraImg,
    'arcinic.png': arinacImg,
    'baby_glow.png': babyGlowImg,
    'biabetic-care.png': diabeticCareImg,
    'blood_pressure_measurer.png': bloodPressureImg,
    'caffeine.png': caffeineImg,
    'ceevit.png': ceevitImg,
    'dermalogica.png': dermalogicaImg,
    'emafil.png': enfamilImg,
    'equipment.png': equipmentImg,
    'fexo.png': fexoImg,
    'good_genes_skin_syrum.png': goodGenesImg,
    'luna_skin_syrum.png': lunaOilImg,
    'magnesium_gycinate.png': magnesiumGlycinateImg,
    'magnesium_supplement.png': magnesiumSupplementImg,
    'mythyl.png': methylcobalaminImg,
    'napa.png': napaImg,
    'omezol.png': omezolImg,
    'ordinary_syrup.png': ordinaryNiacinamideImg,
    'panadol.png': panadolImg,
    'probiotic.png': probioticImg,
    'sergel.png': sergelImg,
    'vital_omega3_fish_oil.png': vitalOmega3Img,
    'whey_suplement.png': wheySupplementImg
};

const mapLocalImage = (medicine) => {
    if (!medicine) return medicine;
    
    // If it's already a full web URL or base64 data, do not map it to local images
    if (medicine.image && (medicine.image.startsWith('http') || medicine.image.startsWith('data:image'))) {
        return medicine;
    }

    // First try the direct filename mapping
    if (medicine.image && IMAGE_MAP[medicine.image]) {
        return { ...medicine, image: IMAGE_MAP[medicine.image] };
    }

    // Substring fallback
    const lowerName = (medicine.name || '').toLowerCase();
    let localImage = null;

    if (lowerName.includes('panadol') || lowerName.includes('alvedon')) {
        localImage = panadolImg;
    } else if (lowerName.includes('napa')) {
        localImage = napaImg;
    } else if (lowerName.includes('surbex')) {
        localImage = IMAGE_MAP['surbex_z.png'] || bComplexImg;
    } else if (lowerName.includes('arinac') || lowerName.includes('arcinic')) {
        localImage = arinacImg;
    } else if (lowerName.includes('fexo')) {
        localImage = fexoImg;
    } else if (lowerName.includes('sergel')) {
        localImage = sergelImg;
    } else if (lowerName.includes('omezol')) {
        localImage = omezolImg;
    } else if (lowerName.includes('ceevit')) {
        localImage = ceevitImg;
    } else if (lowerName.includes('aloe vera')) {
        localImage = aloeVeraImg;
    } else if (lowerName.includes('dermalogica')) {
        localImage = dermalogicaImg;
    } else if (lowerName.includes('good genes')) {
        localImage = goodGenesImg;
    } else if (lowerName.includes('luna retinol')) {
        localImage = lunaOilImg;
    } else if (lowerName.includes('niacinamide') || lowerName.includes('ordinary')) {
        localImage = ordinaryNiacinamideImg;
    } else if (lowerName.includes('baby glow')) {
        localImage = babyGlowImg;
    } else if (lowerName.includes('enfamil') || lowerName.includes('emafil')) {
        localImage = enfamilImg;
    } else if (lowerName.includes('blood pressure')) {
        localImage = bloodPressureImg;
    } else if (lowerName.includes('gluco') || lowerName.includes('diabetic')) {
        localImage = diabeticCareImg;
    } else if (lowerName.includes('first aid') || lowerName.includes('equipment')) {
        localImage = equipmentImg;
    }

    if (localImage) {
        return { ...medicine, image: localImage };
    }
    return medicine;
};

export const medicineService = {
    // Medicines
    async getMedicines(params = {}) {
        const query = new URLSearchParams(params).toString();
        const data = await api.get(`/medicines?${query}`);
        if (Array.isArray(data)) {
            return data.map(mapLocalImage);
        }
        return data;
    },

    async getMedicineById(id) {
        const data = await api.get(`/medicines/${id}`);
        return mapLocalImage(data);
    },

    async createMedicine(medicineData) {
        return api.post('/medicines', medicineData);
    },

    async uploadMedicineImage(formData) {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}/medicines/upload-image`, {
            method: 'POST',
            body: formData,
            headers,
        });

        if (!response.ok) {
            throw new Error(`Image upload failed with status ${response.status}`);
        }

        return response.json();
    },

    async updateMedicine(id, medicineData) {
        return api.put(`/medicines/${id}/stock`, medicineData);
    },

    async deleteMedicine(id) {
        return api.delete(`/medicines/${id}`);
    },

    // Prescriptions
    async uploadPrescription(formData) {
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}/prescriptions/upload`, {
            method: 'POST',
            body: formData,
            headers,
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status ${response.status}`);
        }

        return response.json();
    },

    async getAllPrescriptions() {
        return api.get('/prescriptions');
    },

    async verifyPrescription(id, status) {
        return api.put(`/prescriptions/${id}`, { status });
    },

    // Orders
    async createOrder(orderData) {
        return api.post('/orders', orderData);
    },

    async trackOrder(orderId) {
        return api.get(`/orders/track/${orderId}`);
    },

    async getAllOrders() {
        return api.get('/orders');
    },

    async updateOrderStatus(id, status) {
        return api.put(`/orders/${id}/status`, { status });
    }
};
