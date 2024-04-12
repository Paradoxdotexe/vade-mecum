import type { InventoryItem } from '@/pages/engine/WorldKit';
import { capitalize } from 'lodash-es';

export const getInventoryItemDescription = (item: InventoryItem) => {
  const descriptionParts = [];

  if (item.bonus) {
    descriptionParts.push(`+${item.bonus.skillBonus} to ${capitalize(item.bonus.skillKey)}`);
  }
  if (item.damage) {
    descriptionParts.push(`${item.damage}D6 damage`);
  }
  if (item.notes) {
    descriptionParts.push(item.notes);
  }

  return descriptionParts.join(', ');
};
