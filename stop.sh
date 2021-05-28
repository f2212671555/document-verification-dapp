docker-compose down

echo "remove ipfs volume folder"
rm -rf export
rm -rf ipfs_data
echo "services stopped!!"