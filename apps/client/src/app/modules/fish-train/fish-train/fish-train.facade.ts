import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getBoardedTrain, getLoaded, getSelectedTrain } from './fish-train.selectors';
import { boardTrain, leaveTrain, loadAllTrains, loadFishTrain, loadRunningTrains, selectFishTrain } from './fish-train.actions';
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators';
import { AuthFacade } from '../../../+state/auth.facade';
import { DataType, getExtract, getItemSource } from '@ffxiv-teamcraft/types';
import { LazyDataFacade } from '../../../lazy-data/+state/lazy-data.facade';
import { combineLatest, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FishTrainFacade {

  time$ = interval(1000).pipe(
    map(() => Date.now())
  );

  loaded$ = this.store.pipe(
    select(getLoaded)
  );

  selectedFishTrain$ = this.store.pipe(
    select(getSelectedTrain)
  );

  currentTrain$ = this.authFacade.userId$.pipe(
    switchMap(userId => {
      return this.store.pipe(
        select(getBoardedTrain(userId))
      );
    })
  );

  currentTrainWithLocations$ = this.currentTrain$.pipe(
    switchMap(train => {
      return this.lazyData.getRows('extracts', ...train.fish.map(stop => stop.id)).pipe(
        map(extracts => {
          return {
            ...train,
            fish: train.fish.map(stop => {
              return {
                ...stop,
                node: getItemSource(getExtract(extracts, stop.id), DataType.GATHERED_BY)?.nodes[0]
              };
            })
          };
        })
      );
    }),
    shareReplay(1)
  );

  currentTrainSpotId$ = combineLatest([this.time$, this.currentTrainWithLocations$]).pipe(
    map(([time, train]) => {
      return train.fish.find(stop => stop.end > time && stop.start <= time)?.node.id;
    }),
    distinctUntilChanged()
  );

  constructor(private store: Store, private authFacade: AuthFacade,
              private lazyData: LazyDataFacade) {
  }

  load(id: string): void {
    this.store.dispatch(loadFishTrain({ id }));
  }

  loadRunning(): void {
    this.store.dispatch(loadRunningTrains());
  }

  loadAll(): void {
    this.store.dispatch(loadAllTrains());
  }

  select(id: string): void {
    this.store.dispatch(selectFishTrain({ id }));
  }

  boardTrain(id: string): void {
    this.store.dispatch(boardTrain({ id }));
  }

  leaveTrain(id: string): void {
    this.store.dispatch(leaveTrain({ id }));
  }
}