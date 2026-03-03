import { Style } from 'geostyler-style';

const pointExternalGraphic: Style = {
  name: '',
  rules: [
    {
      name: 'Entrance Only',
      filter: ['==', 'sign_legend', 'Entrance Only'],
      symbolizers: [
        {
          kind: 'Icon',
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAgCAYAAAD5VeO1AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAC4ElEQVRIibXWTUgUYRzH8a86Yl4kzVmZIio7JLst7YxeRdQkctysS0Edc7tYh+gioVLbIt6CdDVIPAp1EDRXiF4siIrIHWjbqJM3H5cxKMQtc9vtkLu9ObOzoL/jM/N8/s/zzJ+ZkdjGSNuOm6a5u7Kysn7LUEm6n8OFEMquqqrprcIzmUxDUVHRfN5jMU0TWZZ5MTXNgdpaalwuimtcjorY4qZpsvTkKTsePKbu0RwAnwHJ66H0aAsr507jclkXssW/P3zCnp5+1v8ZT8XipGJxymPviF+5hMfjKQxPzD2j7Oo1u9qsP5qj1nsYCsHj8TgHXr3mWzptiwMkb43wpuEIjY2NznBZlkk9f0nZ2dN58bWJe1QYb8EpXlJSwvf3H9g5GETybr7lbH7E4lRJm5/upqPpdJrS6l18vTmcFweQDtY6x2VZZrW1mbWJu6xvtKBVimtcKMfanOMA5ZcvsjZx1xYGKG1tZnl5merqauf4p+IiKgaDrPb0W8LFLU0kr1xC3gS2xWVZhrNnKPEeJtnTRyoW/z3J6+HL8TZWWppwy7Jl8bzvFsnroSIySeLDR1KJBABlHjd7LVZbEJ5NTd0hqDvk9Pb8+PVgELG4iN/vByBqGKiqihACwzAA6OvtRVGUwvH5+Xmmp6YA2Ld/P7quo/p8kMmgqSqAJZwXz67+QiCAoig50GlscSEE9ZqGEAJN07gRChEeHt4a/PboKEII4NfZdp0/D0B9vbPPrSUejUYxDANd13MF/kx2N5HZWfT29sLwO2Nj+Hw+Tp46ha7rKIpCZGaGDr8fZWkJgFAoRDQaLRwXQjA0NMT4+DgAkZmZv67r7e10d3cTDoetiPwPNNtqekcHwWCQjo2eB9BU1baDLPH+vj4GBgYIdHXlCgQCATRVJRQKMRuJoGma3dqscU3TGB0Z+W8MYHJy0hb9C19YWBBut/uEoxkOspZMihze2dm5CCxuFZ7Ntv7l/gQYGvFshJBPEwAAAABJRU5ErkJggg==',
          size: 17,
          format: 'image/png',
        },
      ],
    },
    {
      name: 'Number',
      filter: ['==', 'sign_legend', 'Number'],
      symbolizers: [
        {
          kind: 'Icon',
          // the problem seems to be this base64
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAQCAYAAABKkhw/AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAESklEQVRIieWWzU8VVxiHn/fMvcy9fCtBip8VRNKmKJHUpqkfERc1YVEbEyOJG1e60fix8C9QVhKDCcsSogZWrjBtwk0wwXZRQqotNCm1xqpg9QL3ckHmztyZc7pQqHBRrlGbmv5W7/zed855nzNnZk6I/5lCS5k9PT1fbti44StADEa00aJQGQxaixaF8pRStjZaY1CiZDbQQX7YCucHOvAMZlqhBDBAmSAZI8YPgsAXJV5IhbwgCCyDKRPEFZEgMIFliRUVJRGllGitJdDBY9GiDCZkKcsKCAIMYaWUbbRJIbgGo8OhcDWgBHEymczYVGJqeOfOnd/kBHzx4sUKU2V6dv+4OzTpTr7Nxf1XFA1FaalvyQC5AVdVVW3sT/W/l7AAju8QexILvyyfBZxOpzMG8267escyGIwxAiAiC2CWfIcXS0SoW1nH0OQQ2uhX1hbnFZPyUghCTUkNI1Mjr93wCnsFCTfx1mthCeBwOGwt9g5WHeToR0fpHe2l5aeWVw7YuLqRvrE+NpdspmtvF5u6N+XczJz2f7ifjt86cqq90niFpm+bsvzFT3ZOWcDJZDJF5UIvNhrj3KfnmEhPUBYp49IXlxh3xrk1cYu703c5veU0zbFmnvpPAbjaeJV1hesIqzCHaw5TmV/J2fqzrOpcxdrCtVz4/ALtw+0kvSS1JbU0lDcQUiGGJ4fZVbmLvrG+nGDPbDlDbUktJz45QdtQ24Jczlu6uLi4aLGX9tM0fddEx+4OCsOFzPqzFIQLAHg48xBf+1jqn41RU1JDbDTGjg92cLLuJJ0jnRhjQOD+zH0ezT7CtuwFc+xZvYfq4mpuj9/OCRagbmUdDdcaGPh6gK47XcTT8WXvyQKORqN5iz1Xu+xdvZcDvQeYcCdorm5mZGqEuBPnsfOYtqE2HN8BYHB8kG3XtuEGLvvW7uPezD22l2/n+A/H59//y79fZvTpKIeqDjHpTtL9Rzf9j/opi5TR/Uc3a/LX5AR85MYRTm05RWNPYxZszlva9/0gy9M+7b+2z193jnQuyN8YuzEfP5h5MB/33O8BYGhyaEH9wJMBAFp/aZ33Bhmcj++k7izVa5YMhtafW5cvfEFZwJ7n+a81wnumLOB4PD5e/3E9StSyv6D/ogRha+lWrnN9yXwW8LFjx/68+f3Na72f9e5PuAllMCA8OzMjwLOttCBWksGgjDHWnC+WeEabMAZ5sR55fqoxc8YbyxjMs1EVOqqiusQtiZ3nfG7AImKMMQeBsunpaT0zMzOrlJKKiopKwPY8z+Tl5XmABnAcJxONRscAC1ifTqf9SCSSAlLAetd1xbZtcRzH0Vr7BQUFs8lk0iotLY0unjuRSMzm5+eX27ZtA7ium/Y8b6qoqMgAec/7DdLpdF4kEom6ruvatv0XoOLxOOXl5T6gRcR72eosedISkQB4sshe7ksSLFFz9xX1yZf4U8vM80b6GyCb2xhrhxymAAAAAElFTkSuQmCC',
          size: 45,
          format: 'image/png',
        },
      ],
    },
  ]
};

export default pointExternalGraphic;
