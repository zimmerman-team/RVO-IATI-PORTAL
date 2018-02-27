from iati.parser import post_save


def change_m2m_parent_activity(activity, related_set):
  for related_model in related_set.all():
    related_model.activity = activity
    related_model.save()


def change_related_model_parent_activity(activity, related_set):
  for related_model in related_set.all():
    related_model.activity = activity
    related_model.save()


def change_related_activity_parent_activity(activity, related_set):
  for related_model in related_set.all():
    related_model.current_activity = activity
    related_model.save()


def change_one_to_one_parent_activity(activity, related_model):
  try:
    related_model.activity = activity
    related_model.save()
  except Exception:
    print 'no on to one'


def change_activity_id(old_id, new_id):
  #
  activity = Activity.objects.get(pk=old_id)
  activity.id = new_id
  activity.save()
  #
  new_activity = activity
  old_activity = Activity.objects.get(pk=old_id)
  #
  print new_activity
  #
  change_related_model_parent_activity(new_activity, old_activity.reporting_organisations)
  change_one_to_one_parent_activity(new_activity, old_activity.title)
  change_related_model_parent_activity(new_activity, old_activity.description_set)
  change_related_model_parent_activity(new_activity, old_activity.participating_organisations)
  change_related_model_parent_activity(new_activity, old_activity.activitydate_set)
  change_related_model_parent_activity(new_activity, old_activity.contactinfo_set)
  change_m2m_parent_activity(new_activity, old_activity.activityrecipientcountry_set)
  change_m2m_parent_activity(new_activity, old_activity.activityrecipientregion_set)
  change_related_model_parent_activity(new_activity, old_activity.location_set)
  change_m2m_parent_activity(new_activity, old_activity.activitysector_set)
  change_related_model_parent_activity(new_activity, old_activity.humanitarianscope_set)
  change_m2m_parent_activity(new_activity, old_activity.activitypolicymarker_set)
  change_related_model_parent_activity(new_activity, old_activity.planneddisbursement_set)
  change_related_model_parent_activity(new_activity, old_activity.budget_set)
  change_related_model_parent_activity(new_activity, old_activity.transaction_set)
  change_related_model_parent_activity(new_activity, old_activity.documentlink_set)
  change_related_activity_parent_activity(new_activity, old_activity.relatedactivity_set)
  change_related_model_parent_activity(new_activity, old_activity.result_set)
  #
  post_save.set_related_activities(new_activity)
  post_save.set_participating_organisation_activity_id(new_activity.participating_organisations)
  post_save.set_transaction_provider_receiver_activity(new_activity)
  post_save.set_derived_activity_dates(new_activity)
  post_save.set_activity_aggregations(new_activity)
  post_save.update_activity_search_index(new_activity)
  post_save.set_country_region_transaction(new_activity)
  post_save.set_sector_transaction(new_activity)
  post_save.set_sector_budget(new_activity)
  old_activity.delete()



change_activity_id("NL-KVK-2737852-MAT17AO02", "NL-KVK-27378529-MAT17AO02")
change_activity_id("NL-KVK-2737852-MAT17AO05A", "NL-KVK-27378529-MAT17AO05A")
change_activity_id("NL-KVK-2737852-MAT17CI01", "NL-KVK-27378529-MAT17CI01")
change_activity_id("NL-KVK-2737852-MAT17IN01", "NL-KVK-27378529-MAT17IN01")
change_activity_id("NL-KVK-2737852-MAT17KV01", "NL-KVK-27378529-MAT17KV01")
change_activity_id("NL-KVK-2737852-MAT17SN02", "NL-KVK-27378529-MAT17SN02")
change_activity_id("NL-KVK-2737852-MAT17SR01", "NL-KVK-27378529-MAT17SR01")
change_activity_id("NL-KVK-2737852-MAT17ZA01A", "NL-KVK-27378529-MAT17ZA01A")
change_activity_id("NL-KVK-2737852-MAP17ZA01", "NL-KVK-27378529-MAP17ZA01")
change_activity_id("NL-KVK-2737852-MAT17PK01", "NL-KVK-27378529-MAT17PK01")
change_activity_id("NL-KVK-2737852-MAT17SN03", "NL-KVK-27378529-MAT17SN03")

