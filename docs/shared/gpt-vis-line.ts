import { Line } from '@antv/gpt-vis/dist/esm/vis/line/index.js';
import { parse } from '@antv/gpt-vis/dist/esm/syntax/parser.js';

type Chart = {
  render: (config: Record<string, unknown>) => void;
  destroy: () => void;
};

type Options = {
  container: HTMLElement;
  width?: number;
  height?: number;
  theme?: 'default' | 'light' | 'dark' | 'academy';
};

/**
 * Line-only stand-in for the public `GPTVis` class.
 *
 * `@antv/gpt-vis`'s package entry also loads every G6 chart. Parsing that graph
 * during `vitepress build` exceeds Netlify's default Node heap. `Line` is the
 * same G2 renderer the full class uses for `vis line`.
 */
export class GPTVis {
  private chart: Chart | null = null;

  constructor(private readonly options: Options) {}

  render(config: string | Record<string, unknown>) {
    const chartConfig = (
      typeof config === 'string' ? parse(config) : config
    ) as Record<string, unknown>;
    if (chartConfig.type && chartConfig.type !== 'line') {
      throw new Error(
        `This docs build renders line charts only (received "${String(chartConfig.type)}").`,
      );
    }
    if (!this.chart) {
      this.chart = Line(this.options);
    }
    this.chart.render(chartConfig);
  }

  destroy() {
    this.chart?.destroy();
    this.chart = null;
  }
}
