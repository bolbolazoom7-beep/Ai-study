import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addOrUpdateExplanation,
  removeExplanation,
  addOrUpdateConversation,
  removeConversation,
  renameConversation,
} from './storage.ts';
import { SavedExplanation, Conversation } from '../types.ts';

test('addOrUpdateExplanation adds new item and updates existing', () => {
  const item1: SavedExplanation = {
    id: 'exp-1',
    title: 'قانون نيوتن الثاني',
    markdown: 'F = m * a',
    date: '2026-10-20',
  };
  const item2: SavedExplanation = {
    id: 'exp-2',
    title: 'المعادلة التربيعية',
    markdown: 'ax^2 + bx + c = 0',
    date: '2026-10-20',
  };

  let list = addOrUpdateExplanation([], item1);
  assert.equal(list.length, 1);
  assert.equal(list[0].id, 'exp-1');

  list = addOrUpdateExplanation(list, item2);
  assert.equal(list.length, 2);
  assert.equal(list[0].id, 'exp-2');

  const updatedItem1: SavedExplanation = {
    ...item1,
    title: 'قانون نيوتن الثاني - شرح مفصل',
  };
  list = addOrUpdateExplanation(list, updatedItem1);
  assert.equal(list.length, 2);
  const found = list.find((e) => e.id === 'exp-1');
  assert.equal(found?.title, 'قانون نيوتن الثاني - شرح مفصل');
});

test('removeExplanation deletes by id correctly', () => {
  const list: SavedExplanation[] = [
    { id: '1', title: 'A', markdown: 'text', date: '2026-10-20' },
    { id: '2', title: 'B', markdown: 'text', date: '2026-10-20' },
  ];
  const updated = removeExplanation(list, '1');
  assert.equal(updated.length, 1);
  assert.equal(updated[0].id, '2');
});

test('addOrUpdateConversation, renameConversation, and removeConversation work accurately', () => {
  const conv1: Conversation = {
    id: 'conv-1',
    title: 'محادثة فيزياء',
    createdAt: '2026-10-20T10:00:00Z',
    updatedAt: '2026-10-20T10:00:00Z',
    messages: [],
  };

  let conversations = addOrUpdateConversation([], conv1);
  assert.equal(conversations.length, 1);

  conversations = renameConversation(conversations, 'conv-1', 'محادثة فيزياء متقدمة');
  assert.equal(conversations[0].title, 'محادثة فيزياء متقدمة');

  conversations = removeConversation(conversations, 'conv-1');
  assert.equal(conversations.length, 0);
});
