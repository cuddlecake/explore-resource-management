export interface Pokemon {
  id: number;
  name: string;
  sprites: { other: { 'official-artwork': { front_default: string } } };
}

export interface PokemonNavItem {
  name: string;
}
