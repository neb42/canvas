import {
  SELECT_ELEMENT,
  UPDATE_ELEMENT_NAME,
  TOGGLE_ADD_ELEMENT_MODAL,
  Action$Element,
} from 'actions/element';
import { Store$Element } from 'types/store';

const initialState: Store$Element = {
  selectedElement: null,
  isAddElementModalOpen: false,
};

export const element = (
  state: Store$Element = initialState,
  action: Action$Element,
): Store$Element => {
  switch (action.type) {
    case SELECT_ELEMENT: {
      return {
        ...state,
        selectedElement: action.payload,
      };
    }
    case UPDATE_ELEMENT_NAME: {
      if (state.selectedElement === action.payload.id) {
        return {
          ...state,
          selectedElement: action.payload.name,
        };
      }
      return state;
    }
    case TOGGLE_ADD_ELEMENT_MODAL: {
      return {
        ...state,
        isAddElementModalOpen: !state.isAddElementModalOpen,
      };
    }
    default:
      return state;
  }
};
