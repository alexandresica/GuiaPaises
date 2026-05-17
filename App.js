import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Linking,
  SafeAreaView,
} from 'react-native';


export default function App() {
  const [paisDigitado, setPaisDigitado] = useState('');
  const [pais, setPais] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const countries = require("i18n-iso-countries");

  async function buscarPais() {
    if (paisDigitado.trim() === '') {
      setErro('Digite o nome de um país. Exemplo: brazil');
      setPais(null);
      return;
    }

    try {
      setCarregando(true);
      setErro('');
      setPais(null);

      const nomePais = paisDigitado.trim().toLowerCase();
      const resposta = await fetch(`https://restcountries.com/v3.1/name/${nomePais}`);

      if (!resposta.ok) {
        throw new Error('País não encontrado');
      }

      const dados = await resposta.json();
      setPais(dados[0]);
    } catch (error) {
      setErro('Não foi possível encontrar esse país. Tente em inglês, por exemplo: brazil, japan, france.');
    } finally {
      setPaisDigitado('');
      setCarregando(false);
    }
  }

  function RngIso2Codigo() {
    const listaCodigos = Object.keys(countries.getAlpha2Codes());
    const indexRng = Math.floor(Math.random() * listaCodigos.length);
    return listaCodigos [indexRng];
  }

   async function RngPais() {

    try {
      setCarregando(true);
      setErro('');
      setPais(null);

      const cod = RngIso2Codigo();
      const resposta = await fetch(`https://restcountries.com/v3.1/alpha/${cod}`);

      if (!resposta.ok) {
        throw new Error('Erro ao buscar país');
      }

      const dados = await resposta.json();
      setPais(dados[0]);
    } catch (error) {
      setErro('Não foi possível encontrar um país. Tente em novamente.');
    } finally {
      setPaisDigitado('');
      setCarregando(false);
    }
  }

  function formatarNumero(numero) {
    return Number(numero).toLocaleString('pt-BR');
  }

  function obterIdiomas() {
    if (!pais || !pais.languages) return 'Não informado';
    return Object.values(pais.languages).join(', ');
  }

  function obterMoedas() {
    if (!pais || !pais.currencies) return 'Não informado';

    return Object.values(pais.currencies)
      .map((moeda) => `${moeda.name} (${moeda.symbol || 'sem símbolo'})`)
      .join(', ');
  }
  
 
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Guia de Países</Text>
        <Text style={styles.subtitulo}>Busque um país e veja seus dados reais</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite em inglês. Ex: brazil"
          value={paisDigitado}
          onChangeText={setPaisDigitado}
        />

        <TouchableOpacity style={styles.botao} onPress={buscarPais}>
          <Text style={styles.textoBotao}>Buscar País</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoRng} onPress={RngPais}>
          <Text style={styles.textoBotao}>Selecionar um País aleatorio</Text>
        </TouchableOpacity>

        {carregando && <ActivityIndicator size="large" color="#2563EB" style={styles.loading} />}

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

        {pais && (
          <View style={styles.card}>
            <Image source={{ uri: pais.flags.png }} style={styles.bandeira} />

            <Text style={styles.nomePais}>{pais.name.common}</Text>
            <Text style={styles.nomeOficial}>{pais.name.official}</Text>

            <View style={styles.infoBox}>
              <Text style={styles.info}>Capital: {pais.capital ? pais.capital[0] : 'Não informado'}</Text>
              <Text style={styles.info}>Região: {pais.region}</Text>
              <Text style={styles.info}>Sub-região: {pais.subregion || 'Não informado'}</Text>
              <Text style={styles.info}>População: {formatarNumero(pais.population)}</Text>
              <Text style={styles.info}>Idiomas: {obterIdiomas()}</Text>
              <Text style={styles.info}>Moedas: {obterMoedas()}</Text>
            </View>

            {pais.maps && pais.maps.googleMaps && (
              <TouchableOpacity
              style={styles.botaoMapa}
              onPress={() => Linking.openURL(pais.maps.googleMaps)}
              >
                <Text style={styles.textoBotaoMapa}>Abrir no Google Maps</Text>
              </TouchableOpacity>
            )}
            
            {pais.name.common && (
              <TouchableOpacity
              style={styles.botaoWiki}
              onPress={() => Linking.openURL(`https://pt.wikipedia.org/wiki/${pais.name.common}`)}
              >
                <Text style={styles.textoBotaoMapa}>Abrir artigo Wiki</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  botao: {
    width: '100%',
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoRng: {
    width: '100%',
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 25,
  },
  erro: {
    color: '#DC2626',
    marginTop: 20,
    fontSize: 15,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginTop: 25,
    alignItems: 'center',
    elevation: 4,
  },
  bandeira: {
    width: 180,
    height: 110,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 15,
  },
  nomePais: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  nomeOficial: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 18,
    textAlign: 'center',
  },
  infoBox: {
    width: '100%',
    gap: 8,
  },
  info: {
    fontSize: 16,
    color: '#334155',
  },
  botaoMapa: {
    marginTop: 20,
    backgroundColor: '#16A34A',
    padding: 13,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },

  botaoWiki: {
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: '#16A34A',
    padding: 13,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  textoBotaoMapa: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

