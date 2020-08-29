import { createStore } from "vuex";

export type State = { elements: object[] };

const state: State = {
    elements: [
        { name: 'John', id: 1 },
        { name: 'Joao', id: 2 },
        { name: 'Jean', id: 3 },
        { name: 'Gerard', id: 4 },
    ]
};

export const store = createStore({
    state,
    mutations: {
        updateElements(state, payload) {
            state.elements = payload;
        }
    },
    actions: {
        updateElements({ commit }, payload) {
            commit("updateElements", payload);
        }
    },

    getters: {
        elements(state) {
            return state.elements;
        }
    },
    modules: {}
});