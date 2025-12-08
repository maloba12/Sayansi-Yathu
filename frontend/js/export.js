class DataExporter {
    constructor() {
        this.supportedFormats = ['csv', 'json', 'pdf'];
    }

    async exportExperimentData(format, experimentId) {
        const data = await this.fetchExperimentData(experimentId);

        switch(format) {
            case 'csv':
                return this.exportCSV(data);
            case 'json':
                return this.exportJSON(data);
            case 'pdf':
                return this.exportPDF(data);
            default:
                throw new Error('Unsupported format');
        }
    }

    async fetchExperimentData(experimentId) {
        const response = await fetch(`/api/export.php?experiment=${experimentId}&user=${getCurrentUserId()}`);
        return response.json();
    }

    exportCSV(data) {
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => row[header]).join(','))
        ].join('\n');

        this.downloadFile(csvContent, 'experiment-data.csv', 'text/csv');
    }

    exportJSON(data) {
        const jsonContent = JSON.stringify(data, null, 2);
        this.downloadFile(jsonContent, 'experiment-data.json', 'application/json');
    }

    async exportPDF(data) {
        // Use jsPDF for PDF generation
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Sayansi Yathu - Experiment Report', 20, 20);

        doc.setFontSize(12);
        doc.text(`Student: ${data.student_name}`, 20, 40);
        doc.text(`Experiment: ${data.experiment_name}`, 20, 50);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
        doc.text(`Score: ${data.score}/100`, 20, 70);

        // Add data table
        let yPos = 90;
        data.results.forEach((result, index) => {
            doc.text(`${index + 1}. ${result.step}: ${result.value}`, 20, yPos);
            yPos += 10;
        });

        doc.save('experiment-report.pdf');
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }
}

window.dataExporter = new DataExporter();
