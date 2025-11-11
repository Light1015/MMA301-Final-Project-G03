import { mockCertificates } from '../database/db';

class CertificateModel {
    constructor() {
        this.certificates = (mockCertificates || []).map(c => ({ ...c }));
        const maxId = this.certificates.reduce((m, c) => Math.max(m, Number(c.id || 0)), 0);
        this.nextId = maxId + 1;
    }

    getAllCertificates() {
        return [...this.certificates].sort((a, b) => b.id - a.id);
    }

    // Get certificate by ID (coerce id to number)
    getCertificateById(id) {
        const nid = Number(id);
        return this.certificates.find(cert => Number(cert.id) === nid) || null;
    }
    // Check if certificate name already exists (case-insensitive)
    certificateNameExists(certificateName, excludeId = null) {
        const normalized = (certificateName || '').trim().toLowerCase();
        return this.certificates.some(cert => {
            if (excludeId && Number(cert.id) === Number(excludeId)) return false;
            return (cert.certificateName || '').trim().toLowerCase() === normalized;
        });
    }
    // Create new certificate
    createCertificate(certificateData) {
        // Validate: check duplicate name
        if (this.certificateNameExists(certificateData.certificateName)) {
            throw new Error('Certificate name already exists. Please use a different name.');
        }

        const newCertificate = {
            id: this.nextId++,
            ...certificateData,
            issueDate: new Date().toISOString().split('T')[0],
            status: certificateData.status || 'active',
        };
        this.certificates.push(newCertificate);
        return { ...newCertificate };
    }

    // Update certificate
    updateCertificate(id, updatedData) {
        const nid = Number(id);
        const index = this.certificates.findIndex(cert => Number(cert.id) === nid);
        if (index === -1) return null;

        // Validate: check duplicate name (excluding current certificate)
        if (updatedData.certificateName &&
            this.certificateNameExists(updatedData.certificateName, nid)) {
            throw new Error('Certificate name already exists. Please use a different name.');
        }

        this.certificates[index] = {
            ...this.certificates[index],
            ...updatedData,
        };
        return { ...this.certificates[index] };
    }

    // Delete certificate
    deleteCertificate(id) {
        const nid = Number(id);
        const index = this.certificates.findIndex(cert => Number(cert.id) === nid);
        if (index !== -1) {
            const [deleted] = this.certificates.splice(index, 1);
            return deleted;
        }
        return null;
    }

    // Search certificates (case-insensitive)
    searchCertificates(query) {
        if (!query || typeof query !== 'string') return this.getAllCertificates();
        const q = query.trim().toLowerCase();
        return this.certificates.filter(cert =>
            (cert.certificateName || '').toLowerCase().includes(q) ||
            (cert.courseName || '').toLowerCase().includes(q)
        );
    }

    // Filter by status
    filterByStatus(status) {
        return this.certificates.filter(cert => cert.status === status);
    }

    // Get certificates by course
    getCertificatesByCourse(courseId) {
        const nid = Number(courseId);
        return this.certificates.filter(cert => Number(cert.courseId) === nid);
    }
}

export default new CertificateModel();