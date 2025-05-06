import {View, Text, StyleSheet} from "react-native"
import {useEffect, useState} from "react"
import api from "../../utils/api"

export default function TestApi(){
    const [data, setData] = useState(null);

    useEffect(() =>{
        const fetchData = async () => {
            try {
                const response = await api.get(
                    "https://pokeapi.co/api/v2/pokemon/ditto"
                )
                setData(response.data)
                console.log("Data:", response)
            } catch(error){
                console.log(error)
            }
        }
        fetchData()
    },[])

    return(
        <View style={styles.container}>
            {!!data && (
                <>
                    <Text >aa:{data.name}</Text>
                
                    <View>
                        <Text>Habilidade:</Text>
                        {!!data.abilities?.length &&
                            data.abilities.map((item, index) => (
                                <Text key={index} style={styles.abilities}>
                                    {item.ability.name}
                                </Text>
                            ))
                        }
                    </View>
                </>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    bigText: {
        fontSize: 26
    },
    pokemonText: {
        fontWeight: "bold"
    },
    abilities: {
        justifyContent: "center"
    }
})
