const getPokemon = async(pokemon) => {

    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`;
    try {
        const response = await fetch(url);

        if (response.status == 404) {
            throw new Error('not Found');
        }

        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        pokeNotFound(error);
    }

}


const setAbilities = async(abilities,ref) => {
    for (let i = 0; i < ref.childNodes.length;) {
        ref.childNodes[i].remove();
    }

    abilities.forEach((ability, i) =>{
        let li = document.createElement('li');
        li.textContent = ability.ability.name;

        // * descripcion de la habilidad
        setDescription(ability.ability.url, li, i);


        li.addEventListener('click', ()=>{
            const hInfo = document.querySelector(`.hInfo${i}`);
            const closeBtn = document.querySelector(`.closeInfo${i}`);

            const closeBtn2 = document.getElementById('pokeName');
            const setColor = document.querySelector(`.card__header`);
            closeBtn.style.background = setColor.style.background;
            hInfo.style.display = 'block';
            
            // * evento para remover la descripcion 
            closeBtn2.addEventListener('click', removeInfo);

            function removeInfo(e) {
                hInfo.style.display = 'none';
                // e.target.parentNode.style.display
                // hInfo.remove();
                // console.log(hInfo.style.display);
                closeBtn2.removeEventListener('click', removeInfo);
            }

            // setTimeout(() => {
            //     hInfo.style.display = 'none';
            // }, 1000);
        });

        ref.appendChild(li);
    });

}

const setWeaknesses = async(promiseData, ref) => {
    try{
        const response = await fetch(promiseData[0].type.url);
        if (response.status == 404) {
            throw new Error('not Found weaknesses');
        }
        
        const weaknesses = await response.json();
        const {damage_relations} = weaknesses;
        // console.log(weaknesses);

        for (let i = 0; i < ref.childNodes.length;) {
            ref.childNodes[i].remove();
        }
    
        damage_relations.double_damage_from.forEach(weakness =>{
            let li = document.createElement('li');
            li.textContent = weakness.name;
            ref.appendChild(li);
        });

    }catch(err){
        pokeNotFound(err);
    }

}

const setStats = (stats, ref, setBar) => {
    ref.forEach((stat, i) =>{
        ref[i].textContent = `${stats[i].stat.name}: ${stats[i].base_stat}`;
        setBar[i].style.width = `${stats[i].base_stat}%`;

        if (parseInt(stats[i].base_stat) > 100) {
            setBar[i].style.width = '100%'
        }
    });


}

const setCategory = async(promiseData, ref) => {
    try {
        const response = await fetch(promiseData.url);
        if (response.status == 404) {
            throw new Error('Category not Found');
        }
        const data = await response.json();
        setEvo(data); // * buscar las img de las evoluciones y mandarlas al DOM

        const {genera} = data;

        ref.textContent = `Category: ${genera[7] ? genera[7].genus :  genera[0] ? genera[0].genus : 'Not Found'}`;

        // console.log(data);
    } catch (err) {
        pokeNotFound(err);
    }
}

const setDescription = async(promiseData, ref, index) => {
    try {
        const response = await fetch(promiseData);
        if (response.status == 404) {
            throw new Error('Error Description');
        }
        const data = await response.json();
        console.log(data);
        const {flavor_text_entries, effect_entries} = data;

        const info = document.createElement('div');
        info.setAttribute('class', `hInfo${index}`); 
        let validateDescription;
        for (let i = 0; i < flavor_text_entries.length; i++) {
            if (flavor_text_entries[i].language.name == 'en') {
                validateDescription = flavor_text_entries[i].flavor_text;
                info.textContent = `${validateDescription}`;
            }else{
                validateDescription = effect_entries[1].effect;
                info.textContent = `${validateDescription}`;
            }
            break;
        }
        
        const close = document.createElement('a');
        close.setAttribute('class', `closeInfo${index}`);
        close.textContent = 'Close';

        info.appendChild(close);
        ref.appendChild(info);

    } catch (err) {
        pokeNotFound(err);
    }
}

// todo: test
const setEvo = async(promiseData) => {
    try {
        const res = await fetch(promiseData.evolution_chain.url);
        const data = await res.json();
        const {chain} =  data;
        const evoDom = document.querySelectorAll('.evol_img');
        const color = document.querySelector('.card__header')
        let actualEvo;


        evoDom.forEach(async(elem, i) => {
            if (i == 0) {
                actualEvo = chain.species.name;
                const serch = await getPokemon(actualEvo);
                elem.setAttribute('src', `${serch.sprites.other['official-artwork'].front_default}`);
                elem.style.borderColor = color.style.background;
            }else if(i == 1){
                if (chain.evolves_to[0] != undefined) {
                    actualEvo = chain.evolves_to[0].species.name;
                    const serch = await getPokemon(actualEvo);
                    elem.setAttribute('src', `${serch.sprites.other['official-artwork'].front_default}`);
                    elem.style.borderColor = color.style.background;
                }else{
                    elem.setAttribute('src', `img/default.png`);
                    elem.style.borderColor = color.style.background;
                }
                
            }else if (i == 2){
                if (chain.evolves_to[0] != undefined && chain.evolves_to[0].evolves_to[0] != undefined && chain.evolves_to != undefined) {
                    actualEvo = chain.evolves_to[0].evolves_to[0].species.name;
                    const serch = await getPokemon(actualEvo);
                    elem.setAttribute('src', `${serch.sprites.other['official-artwork'].front_default}`);
                    elem.style.borderColor = color.style.background;
                }else{
                    elem.setAttribute('src', `img/default.png`);
                    elem.style.borderColor = color.style.background;
                }
            }
        });
        // console.log(serch);
        // console.log(chain);
    } catch (error) {
        pokeNotFound(error);
    }
} 

// * funciones para la interfaz
const resetAnimation = (ref, ref2) => {
    ref.forEach((elem, i) =>{
        elem.style.animationName = 'none';
        ref2[i].style.animationName = 'none';
        setTimeout(()=>{
            requestAnimationFrame(()=>{
                elem.style.animationName = '';
                ref2[i].style.animationName = '';
            });
        }, 1);
    });

}

const typeColors = {
    electric: 'var(--electric)',
    normal: 'var(--normal)',
    fire: 'var(--fire)',
    water: 'var(--water)',
    ice: 'var(--ice)',
    rock: 'var(--rock)',
    flying: 'var(--flying)',
    grass: 'var(--grass)',
    psychic: 'var(--psychic)',
    ghost: 'var(--ghost)',
    bug: 'var(--bug)',
    poison: 'var(--poison)',
    ground: 'var(--ground)',
    dragon: 'var(--dragon)',
    steel: 'var(--steel)',
    fighting: 'var(--fighting)',
    fairy: 'var(--fairy)',
    dark: 'var(--dark)',
    default: 'var(--default)'
}

const setCardColor = async(types, ref) => {

        let firstColor = typeColors[types[0].type.name];

        ref.header.style.background = firstColor;
        ref.pktype.style.color = firstColor;

        ref.pkAbilities.forEach(elem =>{
            elem.style.background = firstColor;
        });

        setTimeout(()=>{
            document.querySelectorAll('.weaknesses li').forEach(elem =>{
                firstColor = typeColors[elem.textContent];
                elem.style.color = firstColor;
            });
        }, 1000);

}


// * encontrar el error
const pokeNotFound = (err) => {
    alert(err);
    console.log(err);
}


export {getPokemon, setAbilities, setWeaknesses, setStats, resetAnimation, setCardColor, setCategory}