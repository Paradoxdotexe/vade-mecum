import React, { useState } from 'react';
import { VCard } from '@/components/VCard';
import { VDrawer, VDrawerProps } from '@/components/VDrawer';
import { VInput } from '@/components/VInput';
import { VTable } from '@/components/VTable';
import styled from 'styled-components';
import { VCheckbox } from '@/components/VCheckbox';
import { useCharacters } from '../useCharacters';
import { InventoryItemType, WORLD_KITS } from '../WorldKit';
import { VHeader } from '@/components/VHeader';
import { searchObjects } from '@/utils/searchObjects';

const StyledEditItemsDrawer = styled(VDrawer)`
  .drawer__content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px 6px 24px 24px;
    overflow: auto;
    scrollbar-gutter: stable;

    .content__section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
`;

type EditItemsDrawerProps = Pick<VDrawerProps, 'open' | 'onClose'>;

type ItemTypeSection = { type: InventoryItemType; label: string };

const ITEM_TYPE_SECTIONS: ItemTypeSection[] = [
  {
    type: 'WEAPON',
    label: 'Weapons'
  },
  {
    type: 'ARMOR',
    label: 'Armor'
  },
  {
    type: 'TOOL',
    label: 'Tools'
  }
];

export const EditItemsDrawer: React.FC<EditItemsDrawerProps> = props => {
  const { currentCharacter } = useCharacters();

  const [searchQuery, setSearchQuery] = useState('');

  const isSelected = (itemKey: string) => currentCharacter.items.some(item => item.key === itemKey);

  const toggleItem = (itemKey: string) => {
    if (isSelected(itemKey)) {
      currentCharacter.removeItem(itemKey);
    } else {
      currentCharacter.addItem(itemKey);
    }
  };

  const items = searchObjects(
    Object.entries(WORLD_KITS.vale_of_myths.items).map(([key, item]) => ({
      key,
      ...item
    })),
    ['name', 'description'],
    searchQuery
  );

  const renderItemTypeSection = (section: ItemTypeSection) => {
    const itemsOfType = items.filter(item => item.type === section.type);

    return itemsOfType.length ? (
      <div key={section.type} className="content__section">
        <VHeader>{section.label}</VHeader>
        <VCard style={{ padding: 0 }}>
          <VTable
            columns={[
              {
                key: 'selected',
                render: item => <VCheckbox checked={isSelected(item.key)} />
              },
              {
                key: 'name',
                dataKey: 'name'
              },
              { key: 'description', dataKey: 'description', width: '100%' }
            ]}
            rows={itemsOfType}
            onRowClick={row => toggleItem(row.key)}
          />
        </VCard>
      </div>
    ) : null;
  };

  return (
    <StyledEditItemsDrawer {...props} width={800} header={'Edit Inventory'}>
      <div className="drawer__content">
        <VCard style={{ padding: 0 }}>
          <VInput placeholder="Search items..." value={searchQuery} onChange={setSearchQuery} />
        </VCard>
        {ITEM_TYPE_SECTIONS.map(renderItemTypeSection)}
      </div>
    </StyledEditItemsDrawer>
  );
};
