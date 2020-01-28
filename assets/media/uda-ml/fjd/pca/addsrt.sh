#!/bin/sh
for (( i = 20; i < 21; i++ )); do
	 ffmpeg -i ${i}.mp4 -vf subtitles=${i}-cn.srt:force_style='Alignment=2'  ${i}s.mp4
	 ffmpeg -i ${i}s.mp4 -vf subtitles=${i}-en.srt:force_style='Alignment=6'  ${i}-t.mp4
	 rm -f ${i}s.mp4
	 rm -f ${i}.mp4
done
