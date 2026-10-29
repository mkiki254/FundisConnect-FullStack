# Gunicorn settings for FundisConnect.
# Run from the FundisConnect/ folder (the one with manage.py).

# Listen on localhost only. Caddy is the only thing allowed to reach Django, and
# Django trusts the X-Forwarded-Proto header, which anyone could forge if the port were public.
bind = '127.0.0.1:8000'

# One process with several threads. The payment code keeps state in the memory of
# a single process (a known limitation, see the README), so a second worker process
# would lose M-Pesa callbacks. Threads inside one process share that memory safely.
workers = 1
worker_class = 'gthread'
threads = 4

# Large uploads over slow mobile connections can take a while
timeout = 120

# Logs go to the console, which systemd collects in its journal
accesslog = '-'
errorlog = '-'