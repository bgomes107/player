import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { Capability } from 'react-native-track-player';
import { useProgress } from 'react-native-track-player/lib/hooks';
import { useTrackPlayerEvents } from 'react-native-track-player/lib/hooks';
import { Event, State } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import styles from './styles';
import { songDetails } from './music/tracks';

// inicia o player
const trackPlay = async () => {
  await TrackPlayer.setupPlayer();
  TrackPlayer.updateOptions({
    stopWithApp: true,
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.JumpForward,
      Capability.JumpBackward,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
  });

  // adiciona musicas ao player
  await TrackPlayer.add(songDetails);

  return true;
};

// tempo da musica
const secondsToHHMMSS = (seconds: number | string) => {

  seconds = Number(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  const hrs = h > 0 ? (h < 10 ? `0${h}:` : `${h}:`) : '';
  const mins = m > 0 ? (m < 10 ? `0${m}:` : `${m}:`) : '00:';
  const scnds = s > 0 ? (s < 10 ? `0${s}` : s) : '00';
  return `${hrs}${mins}${scnds}`;
};

const App = () => {

  // altera a imagem, titulo e artista quando troca a musica
  const [song, setSong] = useState(0);

  // gerencia se o track player é inicializado ou não
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // o  valor deve ser entre 0 e 1
  const [sliderValue, setSliderValue] = useState(0);

  // sinalizador para verificar se o usuario está deslizando a barra de busca ou não
  const [isSeeking, setIsSeking] = useState(false);

  // fornece a posicao atual e a duracao do player da faixa
  // esses valores serao atualizados a cada 250ms
  const { position, duration } = useProgress(100);


  useTrackPlayerEvents([Event.PlaybackState], (e) => {
    if (e.state === State.Playing) {
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }

  });

  // inicia o TrackPlayer quando o componente App estiver montado
  useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlay();
      setIsTrackPlayerInit(isInit);
    }
    startPlayer();
   
  }, []);

  // atualiza o valor do slider sempre que a posição da música mudar
  useEffect(() => {
    if (!isSeeking && position && duration) {
      setSliderValue(position / duration);
    }

  }, [position, duration]);

  // dá play e pausa
  const onButtonPressed = () => {
    if (!isPlaying) {
      TrackPlayer.play();
      setIsPlaying(true);
    } else {
      TrackPlayer.pause();
      setIsPlaying(false);
    }

  };

  // pula para a proxima musica
  const nextButton = async () => {
    await TrackPlayer.skipToNext();
    setSong(song + 1);
  }

  // pula para a musica anterior
  const previousButton = async () => {
    await TrackPlayer.skipToPrevious();
    setSong(song - 1);
  }

  // funcao chamada quando o usuário começa a deslizar o slider
  const slidingStarted = () => {
    setIsSeking(true);
  };

  //função chamada quando o usuário para de deslizar a barra de busca
  const slidingCompleted = async value => {
    await TrackPlayer.seekTo(value * duration);
    setSliderValue(value);
    setIsSeking(false);

  }

  const currentSong = async () => {
    const current = await TrackPlayer.getCurrentTrack();
    song = await TrackPlayer.getTrack(current);
  }

  let imageAlbum = songDetails[song].artwork;

  return (
    <View style={styles.mainContainer}>

      {/*Imagem do album*/}
      <View style={styles.imageContainer}>
        <Image
          source={{uri: imageAlbum}}
          resizeMode="contain"
          style={styles.albumImage}
        />
      </View>

      {/*Descricao da musica*/}
      <View style={styles.detailsContainer}>
        <Text style={styles.songTitle}>
          {songDetails[song].title}
        </Text>
        <Text style={styles.artist}>
          {songDetails[song].artist}
        </Text>
      </View>

      {/*Slider*/}
      <View style={styles.sliderContainer}>
        <Text style={{
          color: '#d80073',
          alignItems: 'flex-start',
          marginLeft: 10,
          fontSize: 15
        }}>
          {secondsToHHMMSS(Math.floor(position || 0))}
        </Text>
        <Slider
          style={styles.progressBar}
          minimumValue={0}
          maximumValue={1}
          value={sliderValue}
          minimumTrackTintColor="#d80073"
          maximumTrackTintColor="#d80073"
          onSlidingStart={slidingStarted}
          onSlidingComplete={slidingCompleted}
          thumbTintColor="#d80073"
        />
        <Text style={{
          color: '#d80073',
          alignItems: 'flex-end',
          marginRight: 10,
          fontSize: 15
        }}>
          {secondsToHHMMSS(duration || 0)}
        </Text>
      </View>

      {/*Play, Pause, Step-Backward, Step-Forward*/}
      <View style={styles.btnSection}>
        <TouchableOpacity onPress={previousButton} >
          <Icon
            style={styles.prevButton}
            name='step-backward'
            color="#d80073"
            size={30}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onButtonPressed} >
          <Icon
            style={styles.playButton}
            disabled={!isTrackPlayerInit}
            name={isPlaying ? 'pause' : 'play'}
            color="#d80073"
            size={30}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={nextButton} >
          <Icon
            style={styles.nextButton}
            name='step-forward'
            color="#d80073"
            size={30}
          />
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default App;