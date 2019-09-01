#!/bin/bash
set -e

WORLD_FOLDER_OVERWORLD=/root/world/region
OUTPUT_DIR=/root/minecraft-blockmap-viewer/public/worlds
BLOCKMAP_FILE=/root/BlockMap-cli-1.5.1.jar

mkdir -p $OUTPUT_DIR

mkdir -p $OUTPUT_DIR/overworld
java -jar $BLOCKMAP_FILE -v render -l -o=$OUTPUT_DIR/overworld $WORLD_FOLDER_OVERWORLD
# The ocean grounds of the overworld
#mkdir -p $OUTPUT_DIR/overworld_ocean
#java -jar $BLOCKMAP_FILE -v render -l -o=$OUTPUT_DIR/overworld_ocean -c=OCEAN_GROUND $WORLD_FOLDER_OVERWORLD
# All caves up to height 30
#mkdir -p $OUTPUT_DIR/overworld_cave
#java -jar $BLOCKMAP_FILE -v render -l -o=$OUTPUT_DIR/overworld_cave -c=CAVES --max-height=30 $WORLD_FOLDER_OVERWORLD
