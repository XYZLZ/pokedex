import {getPokemon, setCategory, setAbilities, setWeaknesses, setStats, resetAnimation, setCardColor} from './functions.js';
const pokeName = document.getElementById('pokeName');
const pokeId = document.getElementById('pokeId');
const pokeImg = document.getElementById('pokeImg');
const pokeHight = document.getElementById('hight');
const pokeWeight = document.getElementById('weight');
const category = document.getElementById('category');
const pokeType = document.getElementById('type');
const pokeAbilities = document.querySelector('.abilities');
const pokeWeaknesses = document.querySelector('.weaknesses');

const pokeStats = document.querySelectorAll('.stats');
const setBar = document.querySelectorAll('.card__body .skils .bar .line span');
const line = document.querySelectorAll('.card__body .skils .bar .line');

const form = document.getElementById('form');


form.addEventListener ('submit', async(e) => {
    e.preventDefault();

    const {busqueda} = e.target;
    const validateInput = /^[a-zA-Z]{3,16}$/gm.test(busqueda.value);

    if (!validateInput) {
        return alert('Campo invalido');
    }else{
        const data = await getPokemon(busqueda.value);
        if (data != undefined) {
            const {abilities, sprites, stats, name, id, weight, height, types, species} = data;

            pokeId.textContent = `#${id}`;
            pokeName.textContent = name.toUpperCase();
            pokeHight.textContent = `Height: ${height}`;
            pokeWeight.textContent = `Weight: ${weight}`;
            pokeType.textContent = `Type: ${types[0].type.name}`;
            setCategory(species, category);
            pokeImg.setAttribute('src', `${sprites.other['official-artwork'].front_default}`);

            // * reiniciar la animacion
            resetAnimation(setBar, line);

            setAbilities(abilities, pokeAbilities); // * setear las habilidades
            setWeaknesses(types, pokeWeaknesses); // * las debilidades
            setStats(stats, pokeStats, setBar); // * los stats

            setCardColor(types, {
                header:document.querySelector('.card__header'),
                pktype:pokeType,
                pkAbilities:setBar,
            });

        }

    }
});