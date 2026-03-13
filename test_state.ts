// Test script for reparaciones state transitions
import { getReparaciones, updateReparacionEstado } from './src/app/(dashboard)/reparaciones/actions';

async function test() {
    console.log('Initial reparaciones:', await getReparaciones());
    await updateReparacionEstado(1, 'En Curso');
    console.log('After En Curso:', await getReparaciones());
    await updateReparacionEstado(1, 'Finalizado');
    console.log('After Finalizado:', await getReparaciones());
    // Invalid transition: should warn and not change
    await updateReparacionEstado(1, 'Pausado');
    console.log('After invalid Pausado attempt:', await getReparaciones());
}

test();
