dev:
	cd frontend && npm run-script start  & echo "$$!" > /tmp/front.pid
	cd backend && npm run-script start-dev  & echo "$$!" > /tmp/back.pid
	sleep 5
	open "http://localhost:8080/bundle"
	read
	kill $$(cat /tmp/front.pid)
	kill $$(cat /tmp/back.pid)
	rm /tmp/front.pid /tmp/back.pid
	killall node
