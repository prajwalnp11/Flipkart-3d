from django.core.management.base import BaseCommand
import seed_data

class Command(BaseCommand):
    help = 'Seeds Flipkart 3D Virtual Mall with full multi-floor categories, 14 3D products, and 7 smartphone hotspots'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting Flipkart 3D Mall database seed..."))
        try:
            seed_data.seed()
            self.stdout.write(self.style.SUCCESS("Successfully seeded Flipkart 3D Mall data!"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error seeding database: {e}"))
            raise e
