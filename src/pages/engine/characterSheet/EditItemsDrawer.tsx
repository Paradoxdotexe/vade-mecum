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
import { getInventoryItemDescription } from '@/utils/getInventoryItemDescription';

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

const ITEM_TYPE_SECTION_HEADERS: { [key in InventoryItemType]: string } = {
  WEAPON: 'Weapons',
  ARMOR: 'Armor',
  TOOL: 'Tools',
  MEAL: 'Meals',
  LODGING: 'Lodging'
};

export const EditItemsDrawer: React.FC<EditItemsDrawerProps> = props => {
  const { currentCharacter } = useCharacters();

  const [searchQuery, setSearchQuery] = useState('');

  if (!currentCharacter) {
    return null;
  }

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
    ['name', 'notes'],
    searchQuery
  );

  const renderItemTypeSection = (type: InventoryItemType) => {
    const itemsOfType = items.filter(item => item.type === type);

    return itemsOfType.length ? (
      <div key={type} className="content__section">
        <VHeader>{ITEM_TYPE_SECTION_HEADERS[type]}</VHeader>
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
              {
                key: 'cost',
                render: item => `${item.cost} ${item.cost !== 'FREE' ? 'pcs' : ''}`
              },
              {
                key: 'description',
                render: item => getInventoryItemDescription(item),
                width: '100%'
              }
            ]}
            rows={itemsOfType}
            onRowClick={row => toggleItem(row.key)}
            rowDisabled={item => item.type !== InventoryItemType.ARMOR && !item.weight}
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
        {Object.keys(InventoryItemType).map(type =>
          renderItemTypeSection(type as InventoryItemType)
        )}
      </div>
    </StyledEditItemsDrawer>
  );
};
