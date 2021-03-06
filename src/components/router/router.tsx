import { Component, Prop, State } from '@stencil/core';
import createHistory from '../../utils/createBrowserHistory';
import { ActiveRouter, LocationSegments, MatchResults } from '../../global/interfaces';

/**
  * @name Router
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-router'
})
export class Router {
  @Prop() root: string = '/';
  @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;
  unsubscribe: Function = () => {};

  @State() match: MatchResults | null = null;

  computeMatch(pathname?: string) {
    return {
      path: this.root,
      url: this.root,
      isExact: pathname === this.root,
      params: {}
    } as MatchResults;
  }

  componentWillLoad() {
    const history = createHistory();

    history.listen((location: LocationSegments) => {
      this.activeRouter.set({ location });
    });

    this.activeRouter.set({
      location: history.location,
      history
    });

    // subscribe the project's active router and listen
    // for changes. Recompute the match if any updates get
    // pushed
    this.unsubscribe = this.activeRouter.subscribe(() => {
      this.match = this.computeMatch();
    });
    this.match = this.computeMatch();
  }

  componentDidUnload() {
    // be sure to unsubscribe to the router so that we don't
    // get any memory leaks
    this.unsubscribe();
  }

  render() {
    return <slot />;
  }
}
