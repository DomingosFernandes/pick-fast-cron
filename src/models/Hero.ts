export type HeroInfo = {
    id: number, 
    codename: string,
    name: string,
    attribute: string, 
    roles: string[],
    attacktype: string,
};

export type HeroResponse = {
    id: number, 
    name: string, 
    localized_name: string,
    primary_attr: string,
    attack_type: string, 
    roles: string[],
    legs: 2
};