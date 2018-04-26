import {BuffAction} from '../buff-action';
import {Simulation} from '../../../simulation/simulation';
import {Buff} from '../../buff.enum';

export class ManipulationII extends BuffAction {

    getBaseCPCost(simulationState: Simulation): number {
        return 96;
    }

    protected getBuff(): Buff {
        return Buff.MANIPULATION_II;
    }

    protected getDuration(simulation: Simulation): number {
        return 8;
    }

    getIds(): number[] {
        return [4574, 4575, 4576, 4577, 4578, 4579, 4580, 4581];
    }

    protected getInitialStacks(): number {
        return 0;
    }

    protected getTick(): (simulation: Simulation) => void {
        return (simulation: Simulation) => {
            simulation.repair(5);
        };
    }

}
