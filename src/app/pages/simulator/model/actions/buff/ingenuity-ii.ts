import {BuffAction} from '../buff-action';
import {Simulation} from '../../../simulation/simulation';
import {Buff} from '../../buff.enum';

export class IngenuityII extends BuffAction {

    getBaseCPCost(simulationState: Simulation): number {
        return 32;
    }

    protected getBuff(): Buff {
        return Buff.INGENUITY_II;
    }

    protected getDuration(simulation: Simulation): number {
        return 5;
    }

    getIds(): number[] {
        return [283];
    }

    protected getInitialStacks(): number {
        return 0;
    }

    protected getTick(): (simulation: Simulation) => void {
        return undefined;
    }
}
