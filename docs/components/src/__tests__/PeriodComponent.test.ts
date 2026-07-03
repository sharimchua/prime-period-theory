import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PeriodComponent } from '../PeriodComponent.js';

describe('PeriodComponent', () => {
  beforeEach(() => {
    // Component already registered when module loaded
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should define component properties', () => {
    expect(PeriodComponent.componentDef.displayName).toBe('Period');
    expect(PeriodComponent.pptMetadata.shape).toBeDefined();
    expect(PeriodComponent.pptMetadata['starting-angle']).toBeDefined();
  });

  it('should render and update shape and angle', () => {
    const instance = document.createElement('ppt-period') as any;
    document.body.appendChild(instance);

    expect(instance.shape).toBe('circle');
    expect(instance.startingAngle).toBe(-90);

    instance.shape = 'line-horizontal';
    expect(instance.shape).toBe('line-horizontal');

    instance.startingAngle = 0;
    expect(instance.startingAngle).toBe(0);
  });

  it('should layout steps based on shape (circle)', async () => {
    const instance = document.createElement('ppt-period') as any;
    instance.shape = 'circle';
    instance.startingAngle = 0; // 0 is 3 o'clock
    document.body.appendChild(instance);

    const step1 = document.createElement('div');
    step1.slot = 'step';
    const step2 = document.createElement('div');
    step2.slot = 'step';

    instance.appendChild(step1);
    instance.appendChild(step2);

    // Wait for requestAnimationFrame to fire layoutSteps
    await new Promise(r => requestAnimationFrame(r));

    expect(step1.style.left).toBe('100%');
    expect(step1.style.top).toBe('50%');

    // Due to floating point math, check proximity for step2 (angle 180 = Math.PI, cos=-1, sin=0 -> x=0%, y=50%)
    expect(parseFloat(step2.style.left)).toBeCloseTo(0, 1);
    expect(parseFloat(step2.style.top)).toBeCloseTo(50, 1);
  });

  it('should layout steps based on shape (line-horizontal)', async () => {
    const instance = document.createElement('ppt-period') as any;
    instance.shape = 'line-horizontal';
    document.body.appendChild(instance);

    const step1 = document.createElement('div');
    step1.slot = 'step';
    const step2 = document.createElement('div');
    step2.slot = 'step';

    instance.appendChild(step1);
    instance.appendChild(step2);

    // Wait for requestAnimationFrame to fire layoutSteps
    await new Promise(r => requestAnimationFrame(r));

    expect(step1.style.left).toBe('0%');
    expect(step1.style.top).toBe('50%');
    expect(step2.style.left).toBe('100%');
    expect(step2.style.top).toBe('50%');
  });

  it('should layout steps based on shape (line-vertical)', async () => {
    const instance = document.createElement('ppt-period') as any;
    instance.shape = 'line-vertical';
    document.body.appendChild(instance);

    const step1 = document.createElement('div');
    step1.slot = 'step';
    const step2 = document.createElement('div');
    step2.slot = 'step';
    const step3 = document.createElement('div');
    step3.slot = 'step';

    instance.appendChild(step1);
    instance.appendChild(step2);
    instance.appendChild(step3);

    // Wait for requestAnimationFrame to fire layoutSteps
    await new Promise(r => requestAnimationFrame(r));

    expect(step2.style.left).toBe('50%');
    expect(step2.style.top).toBe('50%'); // (1/2)*100
  });

  it('should layout 1 step correctly (line-horizontal)', async () => {
    const instance = document.createElement('ppt-period') as any;
    instance.shape = 'line-horizontal';
    document.body.appendChild(instance);

    const step1 = document.createElement('div');
    step1.slot = 'step';

    instance.appendChild(step1);

    // Wait for requestAnimationFrame to fire layoutSteps
    await new Promise(r => requestAnimationFrame(r));

    expect(step1.style.left).toBe('50%');
    expect(step1.style.top).toBe('50%');
  });
});
