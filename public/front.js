const consExpert1 = async () => {
    const res = await fetch('api/experto1')
    const data = await res.json()
    const respuest = document.getElementById('respuesta')
    const nuevaRespuest = document.createElement('p')
    nuevaRespuest.textContent = 'Experto 1: ' + data.respuesta1;
    respuest.appendChild(nuevaRespuest)
    respuest.scrollTop = respuest.scrollHeight;
}
const consExpert2 = async () => {
    const res = await fetch('api/experto2')
    const data = await res.json()
    const respuest = document.getElementById('respuesta')
    const nuevaRespuest = document.createElement('p')
    nuevaRespuest.innerHTML = 'Experto 2: ' + data.respuesta2;
    respuest.appendChild(nuevaRespuest)
    respuest.scrollTop = respuest.scrollHeight;
}
const limpiarHist = async () => {
    document.getElementById('respuesta').innerHTML = ''
    const response = await fetch('/api/deltHistorial', {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Error al limpiar el historial');
    }
    const result = await response.json();
}
const descargarPdf = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const respuestas = document.getElementById('respuesta').innerText;
    const content = `${respuestas}\n`;
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 10, 10);
    doc.save('historialrespuestas_experts.pdf');
}
