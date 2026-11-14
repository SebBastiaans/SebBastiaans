import { test } from 'node:test';
import assert from 'node:assert/strict';
import { techStack, withShapes, shapeSpans } from './tech-stack.js';

test('alternates shapes within a level', () => {
	const items = withShapes([{ level: 3 }, { level: 2 }, { level: 3 }, { level: 2 }, { level: 1 }, { level: 3 }]);
	assert.deepEqual(items.map((i) => i.shape), ['square', 'pill', 'wide', 'tall', 'small', 'square']);
});

test('own shape wins and does not take a turn, so the other shapes keep alternating', () => {
	const items = withShapes([{ level: 2, shape: 'pill' }, { level: 2 }, { level: 2 }]);
	assert.deepEqual(items.map((i) => i.shape), ['pill', 'pill', 'tall']);
});

test('level 2 has a good mix of pills and talls', () => {
	const level2 = withShapes(techStack).filter((t) => t.level === 2);
	assert.equal(level2.filter((t) => t.shape === 'tall').length, 5);
});

test('every technique of the spec is there with its level', () => {
	assert.equal(techStack.length, 25);
	assert.deepEqual(techStack.filter((t) => t.level === 3).map((t) => t.name), ['HTML', 'CSS', 'GitHub']);
	assert.equal(techStack.filter((t) => t.level === 2).length, 15);
	assert.equal(techStack.filter((t) => t.level === 1).length, 7);
});

test('every shape has a span', () => {
	for (const t of withShapes(techStack)) assert.ok(shapeSpans[t.shape], `${t.name}: ${t.shape}`);
});

test('every technique has a logo, from simple-icons or an own svg', () => {
	const withoutLogo = techStack.filter((t) => !t.logo && !t.svg).map((t) => t.name);
	assert.deepEqual(withoutLogo, []);
});

test('own svgs are one color, so they follow the text color of their tile like the other logos', () => {
	for (const t of techStack.filter((t) => t.svg)) {
		assert.doesNotMatch(t.svg, /fill="#|fill:#|<image|<style/, t.name);
		assert.match(t.svg, /viewBox=/, t.name);
	}
});
