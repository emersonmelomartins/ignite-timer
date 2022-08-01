import { useContext, useEffect } from 'react'
import { differenceInSeconds } from 'date-fns'
import { CountdownContainer, Separator } from './styles'
import { CyclesContext } from '..'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPast,
    setSecondsPast,
  } = useContext(CyclesContext)

  // transforma minutos em segundos
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  // verifica a quantia restante de segundos passados
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPast : 0

  // transforma quantia restante de segundos em minutos
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  // adiciona '0' para sempre manter 2 digitos
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        // segundos podem não ser exatamente os mesmos segundos
        // dependendo da maquina podem gerar alguns atrasos
        // e calcular de forma incorreta

        // pra resolver isso utilizar a data/hora de inicio
        // e calcular a diferença da data atual com a que
        // foi iniciada é uma solução
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()

          setSecondsPast(totalSeconds)

          clearInterval(interval)
        } else {
          setSecondsPast(secondsDifference)
        }
      }, 1000)
    }

    // return serve para limpar/resetar o que foi feito
    // no useEffect anterior para um não atrapalhar o outro
    // após uma atualização no array de dependencias
    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondsPast,
    totalSeconds,
  ])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
